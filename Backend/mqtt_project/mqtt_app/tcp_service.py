import json
import socket
import threading
from datetime import datetime
from django.utils import timezone


def handle_client(client_socket):
    print("Connection established.")
    try:
        while True:
            client_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
            client_socket.settimeout(120)  # Allow more time for processing
            data = client_socket.recv(1024)
            if not data:
                # If no data is received, it means the client closed the connection.
                print("Client disconnected.")
                break

            print(data)
            print(len(data))
            print(f"Received: {data.decode('utf-8')}")

            try:
                decoded_data = data.decode('utf-8')
                safe_data = decoded_data.replace("\r", "").replace("\n", "")
                json_data = json.loads(safe_data.decode('utf-8'))
                print(json_data)

                if "has_fallen" in json_data:
                    handel_acl_message()

                elif "location" in json_data:
                    handle_gps_message(json_data["location"])

                elif "ecg_record" in json_data:
                    handle_ecg_message(json_data["ecg_record"])

            except json.JSONDecodeError as e:
                print(f"JSON decoding error: {e}")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        client_socket.close()

def start_tcp_server(host='0.0.0.0', port=1234):
    """Starts the TCP server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
        server_socket.bind((host, port))
        server_socket.listen(5)
        print(f"Listening for TCP connections on {host}:{port}...")

        while True:
            client_socket, client_address = server_socket.accept()
            print(f"Connection from {client_address}")
            # Start a new thread to handle the client
            client_thread = threading.Thread(target=handle_client, args=(client_socket,))
            client_thread.start()

def handel_acl_message():
    from .models import Fallen
    fallen = Fallen(last_fallen_time=timezone.now())
    fallen.save()

def handle_gps_message(payload):
    # Extract the GNRMC data from the payload
    gnss_data = payload.split(': ')[1]
    try:
        # Split the GNRMC sentence into its components
        parts = gnss_data.split(',')

        # Ensure the sentence is valid and has the correct number of parts
        if parts[2] == 'A':
            # Latitude and Longitude in NMEA format
            raw_latitude = parts[3]
            lat_direction = parts[4]
            raw_longitude = parts[5]
            long_direction = parts[6]

            # Convert latitude and longitude to decimal degrees
            latitude = convert_to_decimal(raw_latitude, lat_direction)
            longitude = convert_to_decimal(raw_longitude, long_direction)

            # Here, you might want to handle storing or further processing this data
            print(f"Extracted GPS coordinates: Latitude: {latitude}, Longitude: {longitude}")

        else:
            print("GPS data invalid or not available.")

    except Exception as e:
        print(f"An error occurred while processing GPS data: {e}")

def convert_to_decimal(raw_coord, direction):
    # Convert NMEA coordinates to decimal degrees
    # Example: raw_coord = "3545.4559", direction = "N" or "S", "E" or "W"
    degrees = float(raw_coord[:2])
    minutes = float(raw_coord[2:])

    decimal = degrees + (minutes / 60)

    if direction in ['S', 'W']:
        decimal *= -1

    return decimal



def handle_ecg_message(ecg_record):
    from .models import Record
    # print(payload.decode())
    # print(json.loads(payload.decode()))
    # rec = json.loads(payload.decode())["value"]
    print(ecg_record)
    # print(int(float(payload.decode())))
    for value in ecg_record:
        record = Record(integer_field=value, time_field=timezone.now())
        record.save()

if __name__ == "__main__":
    start_tcp_server()
