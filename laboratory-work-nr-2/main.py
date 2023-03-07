import socket
from bs4 import BeautifulSoup
from urllib import parse
import ssl
import argparse

#http request
def req(link):
    url = parse.urlparse(link)
    host = url.netloc
    path = "/"
    port = 443

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((host, port))

    context = ssl.create_default_context()
    ssl_sock = context.wrap_socket(sock, server_hostname=host)

    request = f"GET {path} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n".encode()
    ssl_sock.sendall(request)

    response = b""
    while True:
        data = ssl_sock.recv(4096)
        if not data:
            break
        response += data
    ssl_sock.close()

    soup = BeautifulSoup(response, 'html.parser')
    text = soup.get_text()
    print(text)

# http request for searching on google.com
def searchOnGoogle(word):
    host = "www.google.com"
    port = 443
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sslContext = ssl.create_default_context()
    sock.connect((host, port))
    ssl_sock = sslContext.wrap_socket(sock, server_hostname=host)

    query = word
    path = f"/search?q={parse.quote_plus(query)}&num=10"
    request = f"GET {path} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n".encode()
    ssl_sock.sendall(request)

    response = b""
    while True:
        data = ssl_sock.recv(4096)
        if not data:
            break
        response += data
    ssl_sock.close()
    soup = BeautifulSoup(response, "html.parser")

    # Extract the links to the first 10 search results
    links = []
    for a in soup.find_all("a"):
        href = a.get("href")
        if href.startswith("/url?q="):
            url = parse.unquote(href[7:href.find("&")])
            links.append(url)
            if len(links) == 10:
                break

    for link in links:
        print(links.index(link) + 1, end=". ")
        print(link)

    #make a request to a selected link from first 10
    while True:
        try:
            choice = int(input("If you want to receive HTML page of some of the link, select the number of the link(select 0 to exit): "))
            if choice == 0:
                break
            elif choice < 1 or choice > 10:
                print("Invalid choice. Please enter a number between 1 and 10.")
            else:
                selected_link = links[choice - 1]
                req(selected_link)
        except ValueError:
            print("Invalid choice. Please enter a number between 1 and 10.")

if __name__ ==  "__main__":
    parser = argparse.ArgumentParser(prog='go2web', description="Make HTTP requests and search the web from the command line.")
    parser.add_argument("-u", "--url", type=str, help="Make an HTTP request to the specified URL and print the HTML response in human-readable way.")
    parser.add_argument("-s", "--search", type=str, help="Make an HTTP request to search the term using Google and print top 10 results.")
    args = parser.parse_args()

    if args.url:
        response = req(args.url)
        print(response)
    elif args.search:
        result = searchOnGoogle(args.search)
        print(result)
    else:
        parser.print_help()
