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

function SponsorSys() {
  // Time Grabber
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Navigation Helper
  const navigate = useNavigate();

  // Canvas refs
  const perceptionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const planningCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // State for system data
  const [topicStatus, setTopicStatus] = useState<Record<string, boolean>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: false }), {} as Record<string, boolean>)
  );

  const [speed, setSpeed] = useState<number>(0);
  const [systemHealth, setSystemHealth] = useState({
    perception: 0,
    planning: 0,
    control: 0
  });

  const lastMessageTime = useRef<Record<string, number>>(
    TOPICS.reduce((acc, t) => ({ ...acc, [t.name]: 0 }), {} as Record<string, number>)
  );

  const sensorData = useRef<Record<string, any>>({
    Camera: null,
    Lidar: null,
    GPS: null,
    Imu: null
  });

  const gpsHistory = useRef<Array<{ lat: number; lon: number }>>([]);

  // Time Updater
  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate system health scores
  const calculateHealth = () => {
    const now = Date.now();
    const timeout = 10000;

    const perceptionScore = [
      now - lastMessageTime.current.Camera <= timeout,
      now - lastMessageTime.current.Lidar <= timeout,
      now - lastMessageTime.current.GPS <= timeout
    ].filter(Boolean).length / 3 * 100;

    const planningScore = [
      now - lastMessageTime.current.GPS <= timeout,
      now - lastMessageTime.current.Lidar <= timeout,
      gpsHistory.current.length > 10
    ].filter(Boolean).length / 3 * 100;

    const controlScore = [
      now - lastMessageTime.current.Imu <= timeout,
      now - lastMessageTime.current.GPS <= timeout
    ].filter(Boolean).length / 2 * 100;

    setSystemHealth({
      perception: perceptionScore,
      planning: planningScore,
      control: controlScore
    });
  };

  // ROS connection and subscriptions
  useEffect(() => {
    const ros: any = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    ros.on('connection', () => {
      console.log('✅ Connected to ROSBridge (Sponsor System Page)');

      TOPICS.forEach(({ name, rosTopic, messageType }) => {
        const topic = new ROSLIB.Topic({ ros, name: rosTopic, messageType });

        topic.subscribe((msg: any) => {
          lastMessageTime.current[name] = Date.now();
          setTopicStatus((prev) => ({ ...prev, [name]: true }));
          sensorData.current[name] = msg;

          if (name === 'Imu' && msg.linear_acceleration) {
            const accel = Math.sqrt(
              Math.pow(msg.linear_acceleration.x, 2) +
              Math.pow(msg.linear_acceleration.y, 2)
            );
            setSpeed(Math.abs(accel * 2.237));
          }

          if (name === 'GPS' && msg.latitude && msg.longitude) {
            gpsHistory.current.push({ lat: msg.latitude, lon: msg.longitude });
            if (gpsHistory.current.length > 50) {
              gpsHistory.current.shift();
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
      calculateHealth();
    }, 1000);

    return () => {
      ros.close();
      clearInterval(checkInterval);
    };
  }, []);

  // Draw Perception Box
  useEffect(() => {
    const drawPerception = () => {
      if (!perceptionCanvasRef.current) return;
      const canvas = perceptionCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 50px Arial';
      ctx.fillText('PERCEPTION SUBSYSTEM', 20, 45);

      const healthColor = systemHealth.perception > 66 ? '#00ff00' : 
                         systemHealth.perception > 33 ? '#ffff00' : '#ff0000';
      ctx.fillStyle = '#333';
      ctx.fillRect(20, 60, canvas.width - 40, 30);
      ctx.fillStyle = healthColor;
      ctx.fillRect(20, 60, (canvas.width - 40) * (systemHealth.perception / 100), 30);
      ctx.strokeStyle = '#C1C6C8';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 60, canvas.width - 40, 30);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`${systemHealth.perception.toFixed(0)}% Health`, 25, 82);

      let yPos = 120;

      ctx.fillStyle = topicStatus.Camera ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 12, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 50px Arial';
      ctx.fillText('Camera Feed', 50, yPos + 30);
      if (sensorData.current.Camera) {
        ctx.font = '16px Arial';
        ctx.fillText(`Resolution: ${sensorData.current.Camera.width}x${sensorData.current.Camera.height}`, 250, yPos + 7);
        ctx.fillText(`Encoding: ${sensorData.current.Camera.encoding || 'RGB8'}`, 450, yPos + 7);
      }
      yPos += 50;

      ctx.fillStyle = topicStatus.Lidar ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 12, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 50px Arial';
      ctx.fillText('Lidar System', 50, yPos + 30);
      if (sensorData.current.Lidar) {
        ctx.font = '16px Arial';
        const points = sensorData.current.Lidar.width * sensorData.current.Lidar.height;
        ctx.fillText(`Points: ${points.toLocaleString()}`, 250, yPos + 7);
        ctx.fillText(`Density: ${sensorData.current.Lidar.is_dense ? 'Dense' : 'Sparse'}`, 450, yPos + 7);
      }
      yPos += 50;

      ctx.fillStyle = topicStatus.GPS ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 12, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 50px Arial';
      ctx.fillText('GPS Receiver', 50, yPos + 30);
      if (sensorData.current.GPS) {
        ctx.font = '16px Arial';
        ctx.fillText(`Lat: ${sensorData.current.GPS.latitude.toFixed(6)}°`, 250, yPos + 7);
        ctx.fillText(`Lon: ${sensorData.current.GPS.longitude.toFixed(6)}°`, 450, yPos + 7);
      }
      yPos += 60;

      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 50px Arial';
      ctx.fillText('Sensor Fusion', 20, yPos + 40);
      yPos += 20;
      
      const activeSensors = Object.values(topicStatus).filter(Boolean).length;
      const fusionColor = activeSensors === 4 ? '#00ff00' : 
                         activeSensors >= 2 ? '#ffff00' : '#ff0000';
      ctx.fillStyle = fusionColor;
      ctx.fillRect(20, yPos + 85, 200, 15);
      ctx.fillStyle = '#C1C6C8';
      ctx.font = '25px Arial';
      ctx.fillText(`${activeSensors}/4 sensors active`, 230, yPos + 100);
      yPos += 40;

      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Data Throughput', 20, yPos + 30);
      yPos += 25;
      ctx.font = '30px Arial';
      ctx.fillText('Camera: ~30 Hz', 40, yPos + 75);
      yPos += 25;
      ctx.fillText('Lidar: ~10 Hz', 40, yPos + 85);
      yPos += 25;
      ctx.fillText('GPS: ~5 Hz', 40, yPos + 95);
      yPos += 25;
      ctx.fillText('IMU: ~100 Hz', 40, yPos + 105);
    };

    const interval = setInterval(drawPerception, 100);
    return () => clearInterval(interval);
  }, [topicStatus, systemHealth, sensorData.current]);

  // Draw Planning Box
  useEffect(() => {
    const drawPlanning = () => {
      if (!planningCanvasRef.current) return;
      const canvas = planningCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('MAPPING & PLANNING', 20, 40);

      const healthColor = systemHealth.planning > 66 ? '#00ff00' : 
                         systemHealth.planning > 33 ? '#ffff00' : '#ff0000';
      ctx.fillStyle = '#333';
      ctx.fillRect(20, 55, canvas.width - 40, 25);
      ctx.fillStyle = healthColor;
      ctx.fillRect(20, 55, (canvas.width - 40) * (systemHealth.planning / 100), 25);
      ctx.strokeStyle = '#C1C6C8';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 55, canvas.width - 40, 25);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${systemHealth.planning.toFixed(0)}%`, 25, 73);

      let yPos = 110;
      
      ctx.fillStyle = gpsHistory.current.length > 10 ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 8, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Path Planning', 50, yPos + 20);
      ctx.font = '35px Arial';
      ctx.fillText(`Waypoints: ${gpsHistory.current.length}`, 450, yPos + 20);
      yPos += 40;
           
      ctx.save();
      ctx.globalAlpha = 0;
      ctx.fillStyle = topicStatus.GPS ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 16, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Localization', 50, yPos + 30);
      ctx.font = '35px Arial';
      ctx.fillText(topicStatus.GPS ? 'Active' : 'Offline', 450, yPos + 30);
      yPos += 40;
      ctx.restore();

      ctx.fillStyle = topicStatus.Lidar ? '#00ff00 ' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos - 12, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Obstacle Detection', 50, yPos);
      ctx.font = '35px Arial';
      ctx.fillText(topicStatus.Lidar ? 'Scanning' : 'Offline', 450, yPos);
    };

    const interval = setInterval(drawPlanning, 100);
    return () => clearInterval(interval);
  }, [topicStatus, systemHealth, gpsHistory.current]);

  // Draw Control Box
  useEffect(() => {
    const drawControl = () => {
      if (!controlCanvasRef.current) return;
      const canvas = controlCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('CONTROL SUBSYSTEM', 20, 40);

      const healthColor = systemHealth.control > 66 ? '#00ff00' : 
                         systemHealth.control > 33 ? '#ffff00' : '#ff0000';
      ctx.fillStyle = '#333';
      ctx.fillRect(20, 55, canvas.width - 40, 25);
      ctx.fillStyle = healthColor;
      ctx.fillRect(20, 55, (canvas.width - 40) * (systemHealth.control / 100), 25);
      ctx.strokeStyle = '#C1C6C8';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 55, canvas.width - 40, 25);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${systemHealth.control.toFixed(0)}%`, 25, 73);

      let yPos = 110;

      ctx.fillStyle = topicStatus.Imu ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 8, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Motion Control', 50, yPos + 20);
      ctx.font = '35px Arial';
      ctx.fillText(`Speed: ${speed.toFixed(1)} mph`, 450, yPos + 20);
      yPos += 40;

      ctx.fillStyle = topicStatus.Imu ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 16, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Stabilization', 50, yPos + 30);
      if (sensorData.current.Imu && sensorData.current.Imu.orientation) {
        const q = sensorData.current.Imu.orientation;
        const roll = Math.atan2(2 * (q.w * q.x + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)) * 180 / Math.PI;
        ctx.font = '35px Arial';
        ctx.fillText(`Roll: ${roll.toFixed(1)}°`, 450, yPos + 30);
      }
      yPos += 40;

      ctx.fillStyle = topicStatus.GPS ? '#00ff00' : '#ff0000';
      ctx.beginPath();
      ctx.arc(30, yPos + 24, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#C1C6C8';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('Navigation', 50, yPos + 40);
      ctx.font = '35px Arial';
      ctx.fillText(topicStatus.GPS ? 'Active' : 'Standby', 450, yPos + 40);
    };

    const interval = setInterval(drawControl, 100);
    return () => clearInterval(interval);
  }, [topicStatus, systemHealth, speed, sensorData.current]);

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
        className={`${styles.ProfileButtonSys} ${styles.ButtonActive}`}
      ></button>
      <button
        className={styles.ProfileButtonCam}
        onClick={() => navigate("/sponsorCam")}
      ></button>
      <button
        className={styles.ProfileButtonSens}
        onClick={() => navigate("/sponsorSens")}
      ></button>
      
      <div className={shapes.SponsorBanner}>System Status</div>
      
      <div className={shapes.SponsorSpd}>{speed.toFixed(0)} mph</div>
      
      {/* Mapping & Planning Box */}
      <div className={shapes.SponsorSysBoxPlan}>
        <canvas 
          ref={planningCanvasRef}
          width={900}
          height={500}
          style={{ 
            width: '99%', 
            height: '98.5%',
            backgroundColor: '#1a1a1a',
            display: 'block'
          }}
        />
      </div>
      
      {/* Control Box */}
      <div className={shapes.SponsorSysBoxCrtl}>
        <canvas 
          ref={controlCanvasRef}
          width={900}
          height={500}
          style={{ 
            width: '99%', 
            height: '98.5%',
            backgroundColor: '#1a1a1a',
            display: 'block'
          }}
        />
      </div>
      
      {/* Perception Box */}
      <div className={shapes.SponsorSysBoxPerc}>
        <canvas 
          ref={perceptionCanvasRef}
          width={900}
          height={900}
          style={{ 
            width: '99%', 
            height: '98.5%',
            backgroundColor: '#1a1a1a',
            display: 'block'
          }}
        />
      </div>
      
      <div className={shapes.SponsorDateText}>
        <p>{currentDate.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default SponsorSys;
