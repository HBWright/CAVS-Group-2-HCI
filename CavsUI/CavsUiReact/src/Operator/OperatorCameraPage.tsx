import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import * as ROSLIB from "roslib";
import styles from "../components/ProfilePageButtons.module.css";
import shapes from "./OperatorShapes.module.css";

// ROS topics configuration
const TOPICS = [
  { name: 'Camera', rosTopic: '/mavs/camera', messageType: 'sensor_msgs/msg/Image' },
  { name: 'Lidar', rosTopic: '/mavs/lidar', messageType: 'sensor_msgs/msg/PointCloud2' },
  { name: 'GPS', rosTopic: '/mavs/gps_fix', messageType: 'sensor_msgs/msg/NavSatFix' },
];

function OperatorCam() {
  // Time Grabber
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Navigation Helper
  const navigate = useNavigate();

  // Canvas refs for camera displays
  const cameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lidarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Topic status tracking
  const [topicStatus, setTopicStatus] = useState<Record<string, boolean>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: false }), {} as Record<string, boolean>)
  );

  const lastMessageTime = useRef<Record<string, number>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: 0 }), {} as Record<string, number>)
  );

  // Time Updater
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ROS connection and subscriptions
  useEffect(() => {
    const ros: any = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    ros.on('connection', () => {
      console.log('✅ Connected to ROSBridge');

      TOPICS.forEach(({ name, rosTopic, messageType }) => {
        const topic = new ROSLIB.Topic({ ros, name: rosTopic, messageType });

        topic.subscribe((msg: any) => {
          lastMessageTime.current[name] = Date.now();
          setTopicStatus((prev) => ({ ...prev, [name]: true }));

          // Camera display in OperatorBoxCamFront
          if (name === 'Camera' && msg.data && cameraCanvasRef.current) {
            const canvas = cameraCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const { width, height, data } = msg;
            
            // Decode base64 to binary
            const binaryStr = atob(data);
            const bytes = new Uint8ClampedArray(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }

            // Create image data from RGB bytes
            const imageData = ctx.createImageData(width, height);
            for (let i = 0, j = 0; i < bytes.length; i += 3, j += 4) {
              imageData.data[j] = bytes[i];       // R
              imageData.data[j + 1] = bytes[i + 1]; // G
              imageData.data[j + 2] = bytes[i + 2]; // B
              imageData.data[j + 3] = 255;          // Alpha
            }

            // Draw scaled to canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.getContext('2d')?.putImageData(imageData, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
          }

          // Lidar visualization in OperatorBoxCam2
          if (name === 'Lidar' && msg.data && lidarCanvasRef.current) {
            const canvas = lidarCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear canvas
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Parse point cloud data
            const { width: pWidth, height: pHeight, point_step, data } = msg;
            const binaryStr = atob(data);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
              bytes[i] = binaryStr.charCodeAt(i);
            }

            // Draw points (simplified top-down view)
            ctx.fillStyle = '#00ff00';
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const scale = 20; // Adjust scale as needed

            for (let i = 0; i < bytes.length; i += point_step) {
              // Extract X, Y coordinates (assuming float32)
              const view = new DataView(bytes.buffer, i, 8);
              const x = view.getFloat32(0, true);
              const y = view.getFloat32(4, true);

              const screenX = centerX + x * scale;
              const screenY = centerY - y * scale;

              if (screenX >= 0 && screenX < canvas.width && screenY >= 0 && screenY < canvas.height) {
                ctx.fillRect(screenX, screenY, 2, 2);
              }
            }
          }
        });
      });
    });

    ros.on('error', (err: any) => console.error('❌ ROSBridge error:', err));
    ros.on('close', () => console.log('⚠️ ROSBridge connection closed'));

    // Topic timeout check (mark as inactive if no message for 10s)
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
        onClick={() => navigate("/OperatorMap")}
      ></button>
      <button
        className={styles.ProfileButtonSys}
        onClick={() => navigate("/OperatorSys")}
      ></button>
      <button
        className={`${styles.ProfileButtonCam} ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/OperatorSens")}
      ></button>
      
      <div className={shapes.OperatorBanner}>Camera</div>
      <div className={shapes.OperatorSpd}>mph</div>
      
      <div className={shapes.OperatorCamBoxDiag}>System Diagnostics</div>
      <div className={shapes.OperatorCamDiagText}>
        <span style={{ color: topicStatus.Lidar ? '#00ff00' : '#ff0000' }}>LIDAR </span>
        <span style={{ color: topicStatus.Camera ? '#00ff00' : '#ff0000' }}>Camera </span>
        <span style={{ color: topicStatus.GPS ? '#00ff00' : '#ff0000' }}>GPS</span>
      </div>
      
      {/* Front Camera Display */}
      <div className={shapes.OperatorBoxCamFront} style={{ position: 'relative', overflow: 'hidden' }}>
        <canvas 
          ref={cameraCanvasRef}
          width={1920}
          height={1080}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            backgroundColor: '#000'
          }}
        />
      </div>
      
      {/* Lidar Display */}
      <div className={shapes.OperatorBoxCam2} style={{ position: 'relative', overflow: 'hidden' }}>
        <canvas 
          ref={lidarCanvasRef}
          width={800}
          height={600}
          style={{ 
            width: '100%', 
            height: '100%',
            backgroundColor: '#1a1a1a'
          }}
        />
      </div>
      
      <div className={shapes.OperatorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default OperatorCam;
