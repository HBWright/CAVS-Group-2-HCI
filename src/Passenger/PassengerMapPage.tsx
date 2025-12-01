import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import * as ROSLIB from "roslib";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./PassengerShapes.module.css";

// ROS topics configuration
const TOPICS = [
  { name: 'Camera', rosTopic: '/mavs/camera', messageType: 'sensor_msgs/msg/Image' },
  { name: 'Lidar', rosTopic: '/mavs/lidar', messageType: 'sensor_msgs/msg/PointCloud2' },
  { name: 'GPS', rosTopic: '/mavs/gps_fix', messageType: 'sensor_msgs/msg/NavSatFix' },
  { name: 'Imu', rosTopic: '/mavs/imu', messageType: 'sensor_msgs/msg/Imu' },
];

function PassengerMap() {
  // Time Grabber
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Navigation Helper
  const navigate = useNavigate();

  // Canvas refs
  const gpsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // State for ROS data
  const [topicStatus, setTopicStatus] = useState<Record<string, boolean>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: false }), {} as Record<string, boolean>)
  );

  const [speed, setSpeed] = useState<number>(0);

  const lastMessageTime = useRef<Record<string, number>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: 0 }), {} as Record<string, number>)
  );

  const gpsHistory = useRef<Array<{ lat: number; lon: number }>>([]);

  // Time Updater
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ROS connection and subscriptions
  useEffect(() => {
    const ros: any = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    ros.on('connection', () => {
      console.log('✅ Connected to ROSBridge (Passenger Map Page)');

      TOPICS.forEach(({ name, rosTopic, messageType }) => {
        const topic = new ROSLIB.Topic({ ros, name: rosTopic, messageType });

        topic.subscribe((msg: any) => {
          lastMessageTime.current[name] = Date.now();
          setTopicStatus((prev) => ({ ...prev, [name]: true }));

          // Camera display in PassengerBoxCam
          if (name === 'Camera' && msg.data && cameraCanvasRef.current) {
            const canvas = cameraCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const { width, height, data } = msg;
            
            const binaryStr = atob(data);
            const bytes = new Uint8ClampedArray(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }

            const imageData = ctx.createImageData(width, height);
            for (let i = 0, j = 0; i < bytes.length; i += 3, j += 4) {
              imageData.data[j] = bytes[i];
              imageData.data[j + 1] = bytes[i + 1];
              imageData.data[j + 2] = bytes[i + 2];
              imageData.data[j + 3] = 255;
            }

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.getContext('2d')?.putImageData(imageData, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
          }

          // GPS data processing
          if (name === 'GPS' && msg.latitude && msg.longitude) {
            gpsHistory.current.push({ lat: msg.latitude, lon: msg.longitude });
            if (gpsHistory.current.length > 100) {
              gpsHistory.current.shift();
            }

            if (gpsCanvasRef.current) {
              const canvas = gpsCanvasRef.current;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;

              ctx.fillStyle = '#1a1a1a';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              if (gpsHistory.current.length < 2) return;

              const lats = gpsHistory.current.map(p => p.lat);
              const lons = gpsHistory.current.map(p => p.lon);
              const minLat = Math.min(...lats);
              const maxLat = Math.max(...lats);
              const minLon = Math.min(...lons);
              const maxLon = Math.max(...lons);

              const latRange = maxLat - minLat || 0.001;
              const lonRange = maxLon - minLon || 0.001;

              ctx.strokeStyle = '#00ff00';
              ctx.lineWidth = 3;
              ctx.beginPath();

              gpsHistory.current.forEach((point, idx) => {
                const x = ((point.lon - minLon) / lonRange) * (canvas.width - 40) + 20;
                const y = canvas.height - (((point.lat - minLat) / latRange) * (canvas.height - 40) + 20);

                if (idx === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              });
              ctx.stroke();

              const currentPoint = gpsHistory.current[gpsHistory.current.length - 1];
              const currentX = ((currentPoint.lon - minLon) / lonRange) * (canvas.width - 40) + 20;
              const currentY = canvas.height - (((currentPoint.lat - minLat) / latRange) * (canvas.height - 40) + 20);

              ctx.fillStyle = '#ff0000';
              ctx.beginPath();
              ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.font = '14px Arial';
              ctx.fillText(`Lat: ${msg.latitude.toFixed(6)}`, 10, 20);
              ctx.fillText(`Lon: ${msg.longitude.toFixed(6)}`, 10, 40);
              ctx.fillText(`Alt: ${msg.altitude.toFixed(2)}m`, 10, 60);
            }
          }

          // IMU data for speed
          if (name === 'Imu' && msg.linear_acceleration) {
            const accel = Math.sqrt(
              Math.pow(msg.linear_acceleration.x, 2) +
              Math.pow(msg.linear_acceleration.y, 2)
            );
            setSpeed(Math.abs(accel * 2.237));
          }

          // Path planning visualization
          if (name === 'Lidar' && msg.data && pathCanvasRef.current) {
            const canvas = pathCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const { width: pWidth, height: pHeight, point_step, data } = msg;
            const binaryStr = atob(data);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }

            ctx.fillStyle = '#00ff00';
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const scale = 15;

            for (let i = 0; i < bytes.length && i < 10000; i += point_step) {
              try {
                const view = new DataView(bytes.buffer, i, 8);
                const x = view.getFloat32(0, true);
                const y = view.getFloat32(4, true);

                const screenX = centerX + x * scale;
                const screenY = centerY - y * scale;

                if (screenX >= 0 && screenX < canvas.width && screenY >= 0 && screenY < canvas.height) {
                  ctx.fillRect(screenX, screenY, 2, 2);
                }
              } catch (e) {
                break;
              }
            }

            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, centerY - 30);
            ctx.stroke();
          }
        });
      });
    });

    ros.on('error', (err: any) => console.error('❌ ROSBridge error:', err));
    ros.on('close', () => console.log('⚠️ ROSBridge connection closed'));

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 10000;
      const updatedStatus: Record<string, boolean> = {};
      TOPICS.forEach(({ name }) => {
        updatedStatus[name] = now - lastMessageTime.current[name] <= timeout;
      });
      setTopicStatus(updatedStatus);
    }, 1000);

    return () => {
      ros.close();
      clearInterval(checkInterval);
    };
  }, []);

  return (
    /* Buttons */
    <div className={styles.ProfilePageContainer}>
      <button
        className={styles.ProfileButtonHome}
        onClick={() => navigate("/")}
      ></button>
      <button
        className={`${styles.ProfileButtonMap} ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/passengerSys")}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/passengerCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/passengerSens")}
      ></button>
      
      <div className={shapes.PassengerBanner}>Passenger</div>
      
      <div className={shapes.PassengerBoxDiag}>System Diagnostics</div>
      
      <div className={shapes.PassengerDiagText}>
        <span style={{ color: topicStatus.Lidar ? '#00ff00' : '#ff0000', marginRight: '3rem' }}>LIDAR</span>
        <span style={{ color: topicStatus.Camera ? '#00ff00' : '#ff0000', marginRight: '3rem' }}>Camera</span>
        <span style={{ color: topicStatus.GPS ? '#00ff00' : '#ff0000' }}>GPS</span>
      </div>
      
      {/* GPS Map Display */}
      <div className={shapes.PassengerBoxGPS}>
        <canvas 
          ref={gpsCanvasRef}
          width={1200}
          height={800}
          style={{ 
            width: '100%', 
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'block'
          }}
        />
      </div>
      
      {/* Camera Display */}
      <div className={shapes.PassengerBoxCam}>
        <canvas 
          ref={cameraCanvasRef}
          width={640}
          height={480}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            backgroundColor: '#000',
            display: 'block'
          }}
        />
      </div>
      
      {/* Local Path Display */}
      <div className={shapes.PassengerBoxPath}>
        <canvas 
          ref={pathCanvasRef}
          width={600}
          height={600}
          style={{ 
            width: '100%', 
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'block'
          }}
        />
      </div>
      
      <div className={shapes.PassengerSpd}>
        {speed.toFixed(0)} mph
      </div>
      
      <div className={shapes.PassengerDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default PassengerMap;