import socket
import threading

def handle_client(client_socket):
    """Handles client communication."""
    with client_socket:
        print("Connection established.")
        data = client_socket.recv(1024)
        if data:
            print(f"Received: {data.decode()}")

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

if __name__ == "__main__":
    start_tcp_server()
