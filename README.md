# IP Monitoring

Application to monitor hosts with pinging regularly

# Installation

_Docker and Docker Compose are required_

```
# Clone the repository
git clone https://github.com/thomaslachaux/IP-Monitoring
cd IP-Monitoring

# Initilize the environment variables
cp .env.example .env
vim .env # Edit the file to complete the variables
docker-compose up -d
```

Go to [http://localhost:8080](http://localhost:8080) and enjoy !

# Npm commands

| Command     | Description                        |
| ----------- | ---------------------------------- |
| `start`     | Start the program                  |
| `dev`       | Start the program with live-reload |
| `lint`      | Lint the code                      |
| `lint:fix`  | Lint and fix the code              |
| `api:check` | Check the code                     |

# Capture

![Capture](https://raw.githubusercontent.com/ThomasLachaux/IP-Monitoring/master/captures/capture1.jpg)

# License

The code is under MIT License