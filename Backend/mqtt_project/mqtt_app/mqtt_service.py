# mqtt_app/mqtt_service.py
from datetime import datetime

import paho.mqtt.client as mqtt

HOST = "0.0.0.0"  # Replace with your MQTT broker's address
PORT = 1883
TOPIC = "patient/data"
TOPIC2 = "patient/data2"
TOPIC_ECG = "patient/ecg"
TOPIC_ACL = "patient/acl"

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {str(rc)}")
    client.subscribe(TOPIC)
    client.subscribe(TOPIC2)
    client.subscribe(TOPIC_ECG)
    client.subscribe(TOPIC_ACL)

def on_message(client, userdata, msg):
    # Decode the message and handle it
    print(f"Message received on {msg.topic}: {msg}")

    # Here you could parse the message and interact with the health_care models
    # For example, store the data to the database
    print(msg.topic)
    if msg.topic == TOPIC_ECG:
        handle_ecg_message(msg.payload)

    if msg.topic == TOPIC:
        handle_message(msg.payload)

    if msg.topic == TOPIC_ACL:
        handel_acl_message(msg.payload)


def handel_acl_message(payload):
    from .models import Fallen
    fallen = Fallen(last_fallen_time=datetime.now())
    fallen.save()

def handle_ecg_message(payload):


    from .models import Record
    # print(payload.decode())
    # print(json.loads(payload.decode()))
    # rec = json.loads(payload.decode())["value"]
    print(payload)
    print(int(float(payload.decode())))
    record = Record(integer_field=int(float(payload.decode())), time_field=datetime.now())
    record.save()


def handle_message(payload):
    # Function to parse and process the payload
    # Decode JSON payload if that's your format
    import json
    try:
        print(payload)
        # print(payload.decode())
        # Use health_care's models to save data to the DB
        # Example: Models could include ECG data and fall alert
        # ExampleModel.objects.create(field_name=data['field_value'])
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")

def mqtt_start():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(HOST, PORT, 60)

    # Blocking call that processes network traffic, dispatches callbacks and handles reconnecting.
    # This will also handle reconnections automatically.
    client.loop_forever()
