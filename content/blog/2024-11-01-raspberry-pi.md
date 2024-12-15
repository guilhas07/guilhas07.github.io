---
date: "2024-11-01T19:10:09Z"
title: "Raspberry Pi Setup"
summary: |
    My journey on my Raspberry Pi setup. Learn how to 
    setup it up yourself!
---

## Intro

A few days ago I finnally pulled the trigger and bought a Raspberry Pi. For those who don't know what it is,
Raspberry Pi is a single board computer, where you can run/host multiple services, like VPN, home automation and even Game servers.
I've been spending too much time reading and lerking on subreddits like [r/homeserver](https://www.reddit.com/r/HomeServer/) or [r/selfhosted](https://www.reddit.com/r/selfhosted), so
it was about time. I decided to go with the most recent Raspberry Pi 5 8GB version, so I'm not very limited in terms of
the amount of services that I'm able to run concurrently. Additionnaly to the Raspberry Pi you have to buy multiple things:

-   Power supply
-   Micro-SD and a Micro-SD reader
-   Micro HDMI
-   A protection Box

## Raspberry Pi Setup

The setup was quite straight forward despite being my first time delving into small eletronics. The official Raspberry Pi box came with
rubber feets, a small heat sink which I applied to the CPU and a fan, which I plugged into the fan controller in the Raspberry board.
After, I installed the recommend Raspberry Pi Operating System 64bit version on the Micro-SD, remembering to enable SSH, and inserted on the back side of the board.

So you probably caught on that with SSH enable I don't really need the micro HDMI, and you are right, but as I quickly understood later,
it is never a bad practice to have another way to debug what is happening on your system.

The final steps were the following:
Discover which IP your Raspberry Pi got. There are multiple ways:
Use your router page: Login to your router and see which local IP is assigned.
Use a tool like `nmap` to scan your local network and see the devices in your network.

Having the IP you can login with the following command:

```bash
ssh <user>@<ip>
```

The user is the one you created when downloading the Raspberry Pi OS.

Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

The `-y` or `--assume-yes` flag, as the name implies, answers yes to all the questions when upgrading packages.

Disable SSH password authentication:

To setup a more secure login mechanism I disabled password authentication in favor of the more secure **public key authentication**.
First step was to create a public/private key par on your host computer. You can do that in Linux with the following command:

```bash
ssh-keygen
```

Having the keys created, you copy the public key you just created to a file `authorized_keys` in your `~/.ssh/` directory. The `~` is
equivelent to a directory `/home/<your-user>`. After you can test if you can login to your raspberry pi with the command:

```bash
ssh <your-user>@<ip> -i <path-to-your-key.pub>
```

So you don't have to insert the user, key, and path to your key all the time you can create a config in your main computer `.ssh` directory like so:

```bash
Host my-pi
    Hostname <ip>
    User <your-user>
    IdentifyFile <path-to-your-key>
```

Now to login you use:

```bash
ssh my-pi
```

Finnally, now that you tested you can login through public key authentication you can disable password authentication. To do that you
have to edit the file `/etc/ssh/sshd_config` in your raspberry file. Select the editor you are most familiar with, for me its `vim`, but for most beginners
it would be `nano`. In the raspberry OS, the version of `vim` available its the vim-tiny under the `vi` command.

```bash
vi /etc/ssh/sshd_config
```

Now edit the line `#PasswordAuthentication yes` so it looks like this:

```bash
PasswordAuthentication no
```

Notice the lack of `#` in the beginning of the line, which uncomments the line.

Now you have to restart the ssh service with

```bash
sudo systemctl restart sshd
```

Check if its trully disable by trying to login again with your password.

I hope this guide was insightfull, next I will go through how I hosted my first service `Pi hole`.
