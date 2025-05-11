import RPi.GPIO as GPIO
import time
import paho.mqtt.client as mqtt
import json

# GPIO setup
channel = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.IN)

# MQTT setup
MQTT_BROKER = "849ccde8bee24a28a3de955a812bbf44.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_USERNAME = "group24"
MQTT_PASSWORD = "CITS5506IoT"
MQTT_TOPIC = "alerts/critical"


def send_critical_alert():
    payload = {
        "type": "critical",
        "message": "Sound detected by Raspberry Pi!",
        "source": "raspberry-pi",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")
    }
    client = mqtt.Client()
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.tls_set()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()
    client.publish(MQTT_TOPIC, json.dumps(payload))
    client.loop_stop()
    client.disconnect()


print("Listening for Sound")
try:
    while True:
        if GPIO.input(channel) == GPIO.HIGH:
            print("Sound detected")
            send_critical_alert()
            time.sleep(1)  # Avoid spamming alerts
        else:
            print("...")
        time.sleep(0.1)
except KeyboardInterrupt:
    print("Program stop")
finally:
    GPIO.cleanup() 