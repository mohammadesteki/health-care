import json
import socket
import threading
from datetime import datetime

def handle_client(client_socket):
    """Handles client communication."""
    with client_socket:
        print("Connection established.")
        data = client_socket.recv(1048576)
        if data:
            print(data)
            print(len(data))
            print(f"Received: {data.decode()}")
            json_data = json.loads(str(data.decode()))
            print(json_data)
            if "has_fallen" in json_data:
                handel_acl_message()

            else:
                handle_ecg_message(json.loads(data.decode())["ecg_record"])

def start_tcp_server(host='0.0.0.0', port=1234):
    """Starts the TCP server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
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
    fallen = Fallen(last_fallen_time=datetime.now())
    fallen.save()

def handle_ecg_message(payload):
    from .models import Record
    # print(payload.decode())
    # print(json.loads(payload.decode()))
    # rec = json.loads(payload.decode())["value"]
    print(payload)
    # print(int(float(payload.decode())))
    for item in payload:
        timestamp = int(item["timestamp"])
        value = item["value"]
        record = Record(integer_field=value, time_field=datetime.fromtimestamp(timestamp))
        record.save()

if __name__ == "__main__":
    start_tcp_server()
