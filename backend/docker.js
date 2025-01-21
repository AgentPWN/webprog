const Docker = require('dockerode');
const express = require('express');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const imagePortMap = {
    chal1: { exposedPort: '5000/tcp', hostPort: '80' },
    chal2: { exposedPort: '8080/tcp', hostPort: '8081' },
    chal3: { exposedPort: '3000/tcp', hostPort: '3001' },
  };
export async function dockerize(image){
    portConfig = imagePortMap[image];
    const container = await docker.createContainer({
        Image: image,
        ExposedPorts: {
        [portConfig.exposedPort]: {},
        },
        HostConfig: {
        PortBindings: {
            [portConfig.exposedPort]: [
            {
                HostPort: portConfig.HostPort, 
            },
            ],
        },
        },
    });
    console.log('2')
    console.log('Container created');
    await container.start();
    console.log('Container started');
    res.json({ message: `127.0.0.1:${portConfig.hostPort}` });
    setTimeout(async () => {
        try {
            await container.stop(); 
            console.log(`Container ${container.id} stopped after 10 seconds`);
            await container.remove();
            console.log(`Container ${container.id} removed`);
        } catch (err) {
            console.error(`Error stopping container ${container.id}:`, err);
        }
        }, 10 * 1000); 
    }