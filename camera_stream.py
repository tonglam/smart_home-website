#!/usr/bin/env python3

from picamera2 import Picamera2
from picamera2.encoders import JpegEncoder
from picamera2.outputs import FileOutput
import paho.mqtt.client as mqtt
import time
import base64
import json
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
import io
import numpy as np
from PIL import Image

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MQTT Configuration from environment variables
MQTT_BROKER = os.getenv('MQTT_BROKER')
MQTT_PORT = int(os.getenv('MQTT_PORT', '8883'))
MQTT_USERNAME = os.getenv('MQTT_USERNAME')
MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')
MQTT_TOPIC = os.getenv('MQTT_TOPIC')

# Camera configuration
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
FRAME_RATE = 10  # Frames per second
JPEG_QUALITY = 80  # 0-100, higher means better quality but larger size

class CameraStreamer:
    def __init__(self):
        self.camera = None
        self.client = None
        self.is_running = False
        logger.info("CameraStreamer initialized")

    def setup_camera(self):
        """Initialize the camera with specified settings"""
        try:
            # Initialize the camera
            self.camera = Picamera2()
            logger.info("Picamera2 instance created")
            
            # Configure the camera
            config = self.camera.create_video_configuration(
                main={"size": (FRAME_WIDTH, FRAME_HEIGHT), "format": "RGB888"},
                lores={"size": (FRAME_WIDTH, FRAME_HEIGHT), "format": "YUV420"}
            )
            self.camera.configure(config)
            logger.info("Camera configured")
            
            # Set frame rate
            self.camera.set_controls({"FrameRate": FRAME_RATE})
            
            # Start the camera
            self.camera.start()
            logger.info("Camera started")
            
            return True
        except Exception as e:
            logger.error(f"Error setting up camera: {e}")
            return False

    def setup_mqtt(self):
        """Initialize MQTT client with proper configuration"""
        try:
            self.client = mqtt.Client()
            self.client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
            self.client.tls_set()  # Enable TLS for secure connection
            
            # Set up callbacks
            self.client.on_connect = self.on_connect
            self.client.on_disconnect = self.on_disconnect
            
            # Connect to broker
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()
            logger.info("MQTT client initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Error setting up MQTT client: {e}")
            return False

    def on_connect(self, client, userdata, flags, rc):
        """Callback for when the client connects to the broker"""
        if rc == 0:
            logger.info("Connected to MQTT broker")
        else:
            logger.error(f"Failed to connect to MQTT broker with code: {rc}")

    def on_disconnect(self, client, userdata, rc):
        """Callback for when the client disconnects from the broker"""
        if rc != 0:
            logger.warning(f"Unexpected disconnection from MQTT broker with code: {rc}")

    def process_frame(self, frame):
        """Process the frame and prepare it for transmission"""
        try:
            # Convert numpy array to PIL Image
            image = Image.fromarray(frame)
            
            # Convert to JPEG
            buffer = io.BytesIO()
            image.save(buffer, format='JPEG', quality=JPEG_QUALITY)
            jpg_as_text = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            # Create message
            message = {
                'timestamp': datetime.utcnow().isoformat(),
                'image': jpg_as_text
            }
            
            return json.dumps(message)
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            return None

    def start_streaming(self):
        """Main streaming loop"""
        logger.info("Starting stream method")
        if not self.setup_camera() or not self.setup_mqtt():
            logger.error("Failed to initialize camera or MQTT client")
            return

        self.is_running = True
        frame_interval = 1.0 / FRAME_RATE
        
        try:
            while self.is_running:
                start_time = time.time()
                
                # Capture frame
                frame = self.camera.capture_array()
                logger.debug("Frame captured")
                
                # Process and send frame
                message = self.process_frame(frame)
                if message:
                    self.client.publish(MQTT_TOPIC, message)
                    logger.debug("Frame published")
                
                # Calculate sleep time to maintain frame rate
                elapsed = time.time() - start_time
                sleep_time = max(0, frame_interval - elapsed)
                time.sleep(sleep_time)

        except KeyboardInterrupt:
            logger.info("Streaming stopped by user")
        except Exception as e:
            logger.error(f"Error in streaming loop: {e}")
        finally:
            self.cleanup()

    def cleanup(self):
        """Clean up resources"""
        logger.info("Starting cleanup")
        self.is_running = False
        if self.camera:
            self.camera.stop()
            logger.info("Camera stopped")
        if self.client:
            self.client.loop_stop()
            self.client.disconnect()
            logger.info("MQTT client disconnected")
        logger.info("Cleanup completed")

if __name__ == "__main__":
    try:
        logger.info("Creating CameraStreamer instance")
        streamer = CameraStreamer()
        logger.info("Starting stream")
        streamer.start_streaming()
    except Exception as e:
        logger.error(f"Error in main: {e}") 