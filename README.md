# C.A.V.S at MSU - ROS Web Interface with React UI

ROS 2 Jazzy web-based interface that uses a React-based frontend with the ROS ecosystem using:

---

# Before Running

Before running the setup, make sure the following are installed or configured:

- Ubuntu 24.04 (fully installed and updated)  
  > IMPORTANT: This script does **not** handle OS installation or reboot.  
- Git  
- Node.js (ver 20.19+)  
  > Vite (installed along with newer versions of Node.js)
- roslib
- npm  

---

# Instructions

1. **Create a new project directory and enter it**  

```
bash
mkdir -p ~/cavs-ui
cd ~/cavs-ui
```
2. ***Using git, clone the directory***
```
git clone https://github.com/HBWright/CAVS-Group-2-HCI.git
```
3. ***Ensure that all the packages are installed including npm***
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
npm install roslib @types/roslib
```
4. ***Run the app***
```
npm run dev
```
4. ***Once the app opens, run the rosbridge_websocket in another terminal window, otherwise the ROS2 nodes from demo file won't be published/subscribed***
```
cd ros2_jazzy
source install/setup.bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml 
```
5. ***Play the demo file (example_ros2bag.db3)***
```
cd ros2_jazzy
source install/setup.bash
cd src
cd bag_files
ros2 bag play example_ros2bag.db3 --loop
```

