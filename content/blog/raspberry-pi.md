---
date: "2024-11-01T19:10:09Z"
title: "Raspberry Pi Setup"
summary: |
    My journey on my Raspberry Pi setup. Learn how to 
    set it up yourself!
---

## Intro

A few days ago I finally pulled the trigger and bought a Raspberry Pi. For those who don't know what it is,
Raspberry Pi is a single board computer, where you can run/host multiple services, like VPN, home automation and even Game servers.
I've been spending too much time reading and lurking on subreddits like [r/homeserver](https://www.reddit.com/r/HomeServer/) or [r/selfhosted](https://www.reddit.com/r/selfhosted), so
it was about time. I decided to go with the most recent Raspberry Pi 5 8GB version, so I'm not very limited in terms of
the amount of services that I'm able to run concurrently. Additionally to the Raspberry Pi, you have to buy multiple things:

-   Power supply
-   Micro-SD and a Micro-SD reader
-   Micro HDMI
-   A protection Box

## Raspberry Pi Setup

The setup was quite straightforward despite being my first time delving into small electronics. The official Raspberry Pi box came with
rubber feet, a small heat sink which I applied to the CPU, and a fan, which I plugged into the fan controller in the Raspberry board.
After, I installed the recommended Raspberry Pi Operating System 64bit version on the Micro-SD, remembering to enable SSH, and inserted it on the back side of the board.

So you probably caught on that with SSH enabled I don't really need the micro HDMI, and you are right, but as I quickly understood later,
it is never a bad practice to have another way to debug what is happening on your system.

The final steps were the following:
Discover which IP your Raspberry Pi has. There are multiple ways:
Use your router page: Login to your router and see which local IP is assigned.
Use a tool like `nmap` to scan your local network and see the devices in your network.

Having the IP you can log in with the following command:

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

To set up a more secure login mechanism I disabled password authentication in favor of the more secure **public key authentication**.
The first step was to create a public/private key pair on your host computer. You can do that in Linux with the following command:

```bash
ssh-keygen
```

Having the keys created, you copy the public key you just created to a file `authorized_keys` in your `~/.ssh/` directory. The `~` is
equivalent to a directory `/home/<your-user>`. After you can test if you can log in to your Raspberry Pi with the command:

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

Now to log in you use:

```bash
ssh my-pi
```

Finally, now that you tested you can log in through public key authentication you can disable password authentication. To do that you
have to edit the file `/etc/ssh/sshd_config` in your Raspberry file. Select the editor you are most familiar with, for me it's `vim`, but for most beginners,
it would be `nano`. In the Raspberry OS, the version of `vim` available is the vim-tiny under the `vi` command.

```bash
vi /etc/ssh/sshd_config
```

Now edit the line `#PasswordAuthentication yes` so it looks like this:

```bash
PasswordAuthentication no
```

Notice the lack of `#` at the beginning of the line, which uncomments the line.

Now you have to restart the SSH service with

```bash
sudo systemctl restart sshd
```

Check if it's truly disabled by trying to log in again with your password.

I hope this guide was insightful, next, I will go through how I hosted my first service `Pi hole`.
