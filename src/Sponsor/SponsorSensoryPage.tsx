import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import * as ROSLIB from "roslib";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./SponsorShapes.module.css";

// ROS topics configuration
const TOPICS = [
  { name: 'Camera', rosTopic: '/mavs/camera', messageType: 'sensor_msgs/msg/Image' },
  { name: 'Lidar', rosTopic: '/mavs/lidar', messageType: 'sensor_msgs/msg/PointCloud2' },
  { name: 'GPS', rosTopic: '/mavs/gps_fix', messageType: 'sensor_msgs/msg/NavSatFix' },
  { name: 'Imu', rosTopic: '/mavs/imu', messageType: 'sensor_msgs/msg/Imu' },
];

function SponsorSens() {
  // Time Grabber
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Navigation Helper
  const navigate = useNavigate();

  // Canvas refs for each sensor box
  const cameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lidarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gpsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imuCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // State for sensor data
  const [speed, setSpeed] = useState<number>(0);

  // Topic status tracking
  const [topicStatus, setTopicStatus] = useState<Record<string, boolean>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: false }), {} as Record<string, boolean>)
  );

  const lastMessageTime = useRef<Record<string, number>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: 0 }), {} as Record<string, number>)
  );

  const gpsHistory = useRef<Array<{ lat: number; lon: number }>>([]);
  const imuHistory = useRef<Array<{ x: number; y: number; z: number }>>([]);

  // Time Updater
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ROS connection and subscriptions
  useEffect(() => {
    const ros: any = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    ros.on('connection', () => {
      console.log('✅ Connected to ROSBridge (Sponsor Sensory Page)');

      TOPICS.forEach(({ name, rosTopic, messageType }) => {
        const topic = new ROSLIB.Topic({ ros, name: rosTopic, messageType });

        topic.subscribe((msg: any) => {
          lastMessageTime.current[name] = Date.now();
          setTopicStatus((prev) => ({ ...prev, [name]: true }));

          // Box 1: Camera Display
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

          // Box 2: Lidar Visualization
          if (name === 'Lidar' && msg.data && lidarCanvasRef.current) {
            const canvas = lidarCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = '#0a0a0a';
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
            const scale = 20;

            for (let i = 0; i < bytes.length && i < 15000; i += point_step) {
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
            ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`Points: ${(pWidth * pHeight).toLocaleString()}`, 10, 25);
            ctx.fillText('Top-Down View', 10, 50);
          }

          // Box 3: GPS Track
          if (name === 'GPS' && msg.latitude && msg.longitude) {
            gpsHistory.current.push({ lat: msg.latitude, lon: msg.longitude });
            if (gpsHistory.current.length > 150) {
              gpsHistory.current.shift();
            }

            if (gpsCanvasRef.current) {
              const canvas = gpsCanvasRef.current;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;

              ctx.fillStyle = '#0a0a0a';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              if (gpsHistory.current.length < 2) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 18px Arial';
                ctx.fillText('Waiting for GPS data...', 20, canvas.height / 2);
                return;
              }

              const lats = gpsHistory.current.map(p => p.lat);
              const lons = gpsHistory.current.map(p => p.lon);
              const minLat = Math.min(...lats);
              const maxLat = Math.max(...lats);
              const minLon = Math.min(...lons);
              const maxLon = Math.max(...lons);

              const latRange = maxLat - minLat || 0.0001;
              const lonRange = maxLon - minLon || 0.0001;

              ctx.lineWidth = 3;
              ctx.beginPath();

              gpsHistory.current.forEach((point, idx) => {
                const x = ((point.lon - minLon) / lonRange) * (canvas.width - 60) + 30;
                const y = canvas.height - (((point.lat - minLat) / latRange) * (canvas.height - 60) + 30);

                const progress = idx / gpsHistory.current.length;
                ctx.strokeStyle = `hsl(${120 * progress}, 100%, 50%)`;

                if (idx > 0) {
                  ctx.beginPath();
                  const prevPoint = gpsHistory.current[idx - 1];
                  const prevX = ((prevPoint.lon - minLon) / lonRange) * (canvas.width - 60) + 30;
                  const prevY = canvas.height - (((prevPoint.lat - minLat) / latRange) * (canvas.height - 60) + 30);
                  ctx.moveTo(prevX, prevY);
                  ctx.lineTo(x, y);
                  ctx.stroke();
                }
              });

              const currentPoint = gpsHistory.current[gpsHistory.current.length - 1];
              const currentX = ((currentPoint.lon - minLon) / lonRange) * (canvas.width - 60) + 30;
              const currentY = canvas.height - (((currentPoint.lat - minLat) / latRange) * (canvas.height - 60) + 30);

              ctx.fillStyle = '#ff3333';
              ctx.beginPath();
              ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
              ctx.fill();

              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(5, 5, 200, 85);
              ctx.fillStyle = '#00ff00';
              ctx.font = 'bold 14px Arial';
              ctx.fillText('GPS Position', 10, 25);
              ctx.font = '12px Arial';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(`Lat: ${msg.latitude.toFixed(6)}°`, 10, 45);
              ctx.fillText(`Lon: ${msg.longitude.toFixed(6)}°`, 10, 63);
              ctx.fillText(`Alt: ${msg.altitude.toFixed(2)}m`, 10, 81);
            }
          }

          // Box 4: IMU Data Visualization
          if (name === 'Imu' && msg.orientation && imuCanvasRef.current) {
            if (msg.linear_acceleration) {
              imuHistory.current.push({
                x: msg.linear_acceleration.x,
                y: msg.linear_acceleration.y,
                z: msg.linear_acceleration.z
              });
              if (imuHistory.current.length > 100) {
                imuHistory.current.shift();
              }

              const accel = Math.sqrt(
                Math.pow(msg.linear_acceleration.x, 2) +
                Math.pow(msg.linear_acceleration.y, 2)
              );
              setSpeed(Math.abs(accel * 2.237));
            }

            const canvas = imuCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const q = msg.orientation;
            const roll = Math.atan2(2 * (q.w * q.x + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y));
            const pitch = Math.asin(2 * (q.w * q.y - q.z * q.x));
            const yaw = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z));

            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            const horizonY = centerY + pitch * 100;
            ctx.moveTo(0, horizonY);
            ctx.lineTo(canvas.width, horizonY);
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(roll);
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-80, 0);
            ctx.lineTo(80, 0);
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(yaw);
            ctx.strokeStyle = '#ffff00';
            ctx.fillStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, -60);
            ctx.lineTo(-15, -30);
            ctx.lineTo(0, -40);
            ctx.lineTo(15, -30);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            if (imuHistory.current.length > 1) {
              const graphY = canvas.height - 80;
              const graphHeight = 60;

              ctx.strokeStyle = '#ff0000';
              ctx.lineWidth = 2;
              ctx.beginPath();
              imuHistory.current.forEach((acc, idx) => {
                const x = (idx / 100) * canvas.width;
                const y = graphY + graphHeight / 2 - acc.x * 10;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              });
              ctx.stroke();
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(5, 5, 160, 130);
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('IMU Data', 10, 25);
            ctx.font = '11px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Roll: ${(roll * 180 / Math.PI).toFixed(1)}°`, 10, 45);
            ctx.fillText(`Pitch: ${(pitch * 180 / Math.PI).toFixed(1)}°`, 10, 62);
            ctx.fillText(`Yaw: ${(yaw * 180 / Math.PI).toFixed(1)}°`, 10, 79);
            if (msg.angular_velocity) {
              ctx.fillText(`AngVel: ${msg.angular_velocity.z.toFixed(2)}`, 10, 96);
            }
            if (msg.linear_acceleration) {
              ctx.fillText(`Accel: ${msg.linear_acceleration.x.toFixed(2)}`, 10, 113);
            }
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
        className={styles.ProfileButtonMap}
        onClick={() => navigate("/sponsorMap")}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/sponsorSys")}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/sponsorCam")}
      ></button>
      <button
        className={`${styles.ProfileButtonSens} ${styles.ButtonActive}`}
      ></button>
      
      <div className={shapes.SponsorBanner}>Sensory Data</div>
      
      <div className={shapes.SponsorSpd}>
        {speed.toFixed(0)} mph
      </div>
      
      {/* Box 1: Camera */}
      <div className={shapes.SponsorSensBox1}>
        <canvas 
          ref={cameraCanvasRef}
          width={800}
          height={600}
          style={{ 
            width: '99%', 
            height: '98.5%', 
            objectFit: 'cover',
            backgroundColor: '#000',
            display: 'block'
          }}
        />
      </div>
      
      {/* Box 2: Lidar */}
      <div className={shapes.SponsorSensBox2}>
        <canvas 
          ref={lidarCanvasRef}
          width={800}
          height={600}
          style={{ 
            width: '99%', 
            height: '98.5%',
            backgroundColor: '#0a0a0a',
            display: 'block'
          }}
        />
      </div>
      
      {/* Box 3: GPS */}
      <div className={shapes.SponsorSensBox3}>
        <canvas 
          ref={gpsCanvasRef}
          width={800}
          height={600}
          style={{ 
            width: '99%', 
            height: '98.5%',
            backgroundColor: '#0a0a0a',
            display: 'block'
          }}
        />
      </div>
      
      {/* Box 4: IMU */}
      <div className={shapes.SponsorSensBox4}>
        <canvas 
          ref={imuCanvasRef}
          width={800}
          height={600}
          style={{ 
            width: '99%', 
            height: '98.5%',
            backgroundColor: '#0a0a0a',
            display: 'block'
          }}
        />
      </div>
      
      <div className={shapes.SponsorSenBox1Title} style={{ 
        color: topicStatus.Camera ? '#00ff00' : '#ff0000',
        fontSize: '40px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Camera
      </div>
      <div className={shapes.SponsorSenBox2Title} style={{ 
        color: topicStatus.Lidar ? '#00ff00' : '#ff0000',
        fontSize: '40px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Lidar
      </div>
      <div className={shapes.SponsorSenBox3Title} style={{ 
        color: topicStatus.GPS ? '#00ff00' : '#ff0000',
        fontSize: '40px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        GPS Track
      </div>
      <div className={shapes.SponsorSenBox4Title} style={{ 
        color: topicStatus.Imu ? '#00ff00' : '#ff0000',
        fontSize: '40px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        IMU
      </div>
      
      <div className={shapes.SponsorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default SponsorSens;
