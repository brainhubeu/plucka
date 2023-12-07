# Płucka project
Project for "Hack To The Rescue" hackaton. The goal is to create a digital version of Polish Smog Alert's "Mobilne Płuca" experience.

## Deployment
### Build the image
```bash
docker build -t plucka .
```

The whole app is one container, server is listening on port 8080.

## Development
### Starting the app
```bash
bun dev
```

### Config in dev environment
Create a `.env` file:
```
VITE_OPEN_WEATHER_API_KEY=abcdefghijklmnoprstuwxyz123456789
```
or just set required env variables
