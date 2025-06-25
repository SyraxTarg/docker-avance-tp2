# TP2

## Part I : Packaging basique

```powershell
➜ curl -X GET http://localhost:8000/api/v1/events/
{"count":0,"total":0,"data":[]}
```

## Part II : Des environnements différents

```powershell
docker compose -f docker-compose-prod.yml up --build
```

```powershell
➜ curl -X GET http://localhost:8000/api/v1/events/
{"count":0,"total":0,"data":[]}
```

```powershell
docker compose -f docker-compose-dev.yml up --build
```

```powershell
➜ curl -X GET http://localhost:8000/api/v1/events/
{"count":0,"total":0,"data":[]}
```


```powershell
docker build . -t back-image-prod --target prod
```

```powershell
docker build . -t back-image-dev --target dev
```

## Part III : Base image

debian:latest https://hub.docker.com/layers/library/debian/latest/images/sha256-b6f3fecf8e610ca3a3d47714daad7d2d2fdf8a35879e3c12bb6a2654717f5f6c

alpine:latest https://hub.docker.com/layers/library/alpine/latest/images/sha256-af11d8e82a84ada96b5af358e796120e1c83f685d077b25ec05af8e6bc8827b6

python:3.11-slim https://hub.docker.com/layers/library/python/3.11-slim/images/sha256-38309d629f66168f65a3608680a17e48076bb5028128ea7f03612e34a031fdd4


```powershell
docker run aquasec/trivy:latest image debian:latest
```

```powershell
Report Summary

┌──────────────────────────────┬────────┬─────────────────┬─────────┐
│            Target            │  Type  │ Vulnerabilities │ Secrets │
├──────────────────────────────┼────────┼─────────────────┼─────────┤
│ debian:latest (debian 12.11) │ debian │       78        │    -    │
└──────────────────────────────┴────────┴─────────────────┴─────────┘
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)


debian:latest (debian 12.11)
============================
Total: 78 (UNKNOWN: 0, LOW: 58, MEDIUM: 12, HIGH: 7, CRITICAL: 1)

```


```powershell
docker run aquasec/trivy:latest image alpine:latest
```

```powershell
Report Summary

┌───────────────────────────────┬────────┬─────────────────┬─────────┐
│            Target             │  Type  │ Vulnerabilities │ Secrets │
├───────────────────────────────┼────────┼─────────────────┼─────────┤
│ alpine:latest (alpine 3.22.0) │ alpine │        0        │    -    │
└───────────────────────────────┴────────┴─────────────────┴─────────┘
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)

```

```powershell
docker run aquasec/trivy:latest image python:3.11-slim
```

```powershell
Report Summary

┌─────────────────────────────────────────────────────────────────────────────┬────────────┬─────────────────┬─────────┐
│                                   Target                                    │    Type    │ Vulnerabilities │ Secrets │
├─────────────────────────────────────────────────────────────────────────────┼────────────┼─────────────────┼─────────┤
│ python:3.11-slim (debian 12.11)                                             │   debian   │       100       │    -    │
├─────────────────────────────────────────────────────────────────────────────┼────────────┼─────────────────┼─────────┤
│ usr/local/lib/python3.11/site-packages/pip-24.0.dist-info/METADATA          │ python-pkg │        0        │    -    │
├─────────────────────────────────────────────────────────────────────────────┼────────────┼─────────────────┼─────────┤
│ usr/local/lib/python3.11/site-packages/setuptools-65.5.1.dist-info/METADATA │ python-pkg │        2        │    -    │
├─────────────────────────────────────────────────────────────────────────────┼────────────┼─────────────────┼─────────┤
│ usr/local/lib/python3.11/site-packages/wheel-0.45.1.dist-info/METADATA      │ python-pkg │        0        │    -    │
└─────────────────────────────────────────────────────────────────────────────┴────────────┴─────────────────┴─────────┘
Legend:
- '-': Not scanned
- '0': Clean (no security findings detected)


python:3.11-slim (debian 12.11)
===============================
Total: 100 (UNKNOWN: 0, LOW: 74, MEDIUM: 18, HIGH: 7, CRITICAL: 1)
```

```powershell
➜ Measure-command{docker build -f dockerfile-alpine -t back-alpine:1.0.0 . }

View build details: docker-desktop://dashboard/build/desktop-linux/desktop-linux/yyrnaq88h2qkltgzd42exvmv6

Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 22
Milliseconds      : 367
Ticks             : 223670463
TotalDays         : 0,000258877850694444
TotalHours        : 0,00621306841666667
TotalMinutes      : 0,372784105
TotalSeconds      : 22,3670463
TotalMilliseconds : 22367,0463
```

```powershell
➜ Measure-command{docker build -f dockerfile-debian -t back-debian:1.0.0 . }

View build details: docker-desktop://dashboard/build/desktop-linux/desktop-linux/we8jvqr4z08uvh8csv5vhvew5

Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 23
Milliseconds      : 942
Ticks             : 239429666
TotalDays         : 0,000277117668981481
TotalHours        : 0,00665082405555556
TotalMinutes      : 0,399049443333333
TotalSeconds      : 23,9429666
TotalMilliseconds : 23942,9666
```

```powershell
➜ docker images
REPOSITORY                                      TAG         IMAGE ID       CREATED              SIZE
back-debian                                     1.0.0       dc5d66615190   28 seconds ago       262MB
back-alpine                                     1.0.0       e7843fad5065   About a minute ago   262MB
```

Les deux images font la même taille

Le docker compose avec alpine met plus de 22 secondes à être ready (création de la db, mise en place du service)
Le docker compose avec debian met plus de 22 secondes à être ready (création de la db, mise en place du service)

Avec alpine:

```powershell
➜ Measure-command{curl -X GET http://localhost:8000/api/v1/events}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0

Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 0
Milliseconds      : 377
Ticks             : 3776942
TotalDays         : 4,37146064814815E-06
TotalHours        : 0,000104915055555556
TotalMinutes      : 0,00629490333333333
TotalSeconds      : 0,3776942
TotalMilliseconds : 377,6942
```

Avec debian:

```powershell
➜ Measure-command{curl -X GET http://localhost:8000/api/v1/events}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0

Days              : 0
Hours             : 0
Minutes           : 0
Seconds           : 0
Milliseconds      : 43
Ticks             : 430646
TotalDays         : 4,9843287037037E-07
TotalHours        : 1,19623888888889E-05
TotalMinutes      : 0,000717743333333333
TotalSeconds      : 0,0430646
TotalMilliseconds : 43,0646

```

On remarque que debian est considérablement plus rapide que Alpine.

## Part IV : En vrac

```powershell
➜ docker images
REPOSITORY                                      TAG         IMAGE ID       CREATED          SIZE
back-image-prod                                 1.3.1       7f1dc353be64   12 seconds ago   241MB
back-image-prod                                 1.3.0       139d3009f13f   2 minutes ago    262MB
```

Après avoir vidé le cache api et purgé le cache de pip on gagne à peu pres 20MB.

```powershell
 "Labels": {
                "com.rally.author": "SyraxTarg",
                "com.rally.source": "https://github.com/SyraxTarg/docker-avance-tp2",
                "com.rally.vendor": "SyraxTarg"
            }
```

```powershell
"Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "rally",
```


# TP3

Le tp3 a été effectué sur github action et non sur gitlab.

```powershell
➜ docker pull 20220796/raqiros:latest
latest: Pulling from 20220796/raqiros
dad67da3f26b: Already exists
799440a7bae7: Already exists
9596beeb5a6d: Already exists
15658014cd85: Already exists
dc34246f9a4a: Pull complete
1d3af568f7a5: Pull complete
d42dccc5b9c1: Pull complete
Digest: sha256:0f38228e0f0e2ab9e0531701048e802417caf3c1df867dea8492e240093425d9
Status: Downloaded newer image for 20220796/raqiros:latest
docker.io/20220796/raqiros:latest
```

J'ai juste modifié le dockerfile-prod vu que c'est l'image de prod qui a été push

```powershell
➜ docker compose -f docker-compose-prod.yml up --build
[+] Running 2/2
 ✔ Container db    Created                                                                                                                                                                                       0.0s
 ✔ Container back  Recreated                                                                                                                                                                                     0.1s
Attaching to back, db
```

```powershell
➜ curl -X GET http://localhost:8000/api/v1/events/
{"count":0,"total":0,"data":[]}
```

## Part 3 : Deploy the world

```powershell
➜ ssh syraxtarg@172.201.54.43
The authenticity of host '172.201.54.43 (172.201.54.43)' can't be established.
[...]
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '172.201.54.43' (ED25519) to the list of known hosts.
Welcome to Ubuntu 24.04.2 LTS (GNU/Linux 6.11.0-1015-azure x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Jun 25 07:36:09 UTC 2025

  System load:  0.15              Processes:             115
  Usage of /:   5.5% of 28.02GB   Users logged in:       0
  Memory usage: 27%               IPv4 address for eth0: 10.0.0.4
  Swap usage:   0%

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

syraxtarg@VM-Rally:~$ ls
```

```powershell
syraxtarg@VM-Rally:~$ sudo -l
Matching Defaults entries for syraxtarg on VM-Rally:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User syraxtarg may run the following commands on VM-Rally:
    (ALL : ALL) ALL
    (ALL) NOPASSWD: ALL
```

```powershell
syraxtarg@VM-Rally:~$ groups deploy
deploy : deploy docker
```

En effet, l'app est pétée

```powershell
➜ ssh -i C:\Users\utilisateur/.ssh/deploy-azure deploy@172.201.54.43 docker run 20220796/raqiros:latest
Unable to find image '20220796/raqiros:latest' locally
latest: Pulling from 20220796/raqiros
dad67da3f26b: Pulling fs layer
799440a7bae7: Pulling fs layer
9596beeb5a6d: Pulling fs layer
15658014cd85: Pulling fs layer
dc34246f9a4a: Pulling fs layer
1d3af568f7a5: Pulling fs layer
d42dccc5b9c1: Pulling fs layer
15658014cd85: Waiting
dc34246f9a4a: Waiting
1d3af568f7a5: Waiting
d42dccc5b9c1: Waiting
799440a7bae7: Verifying Checksum
799440a7bae7: Download complete
9596beeb5a6d: Verifying Checksum
9596beeb5a6d: Download complete
dad67da3f26b: Verifying Checksum
dad67da3f26b: Download complete
15658014cd85: Verifying Checksum
15658014cd85: Download complete
dc34246f9a4a: Verifying Checksum
dc34246f9a4a: Download complete
1d3af568f7a5: Verifying Checksum
1d3af568f7a5: Download complete
dad67da3f26b: Pull complete
799440a7bae7: Pull complete
d42dccc5b9c1: Verifying Checksum
d42dccc5b9c1: Download complete
9596beeb5a6d: Pull complete
15658014cd85: Pull complete
dc34246f9a4a: Pull complete
1d3af568f7a5: Pull complete
d42dccc5b9c1: Pull complete
Digest: sha256:0f38228e0f0e2ab9e0531701048e802417caf3c1df867dea8492e240093425d9
Status: Downloaded newer image for 20220796/raqiros:latest
Traceback (most recent call last):
  File "//main.py", line 9, in <module>
    from database.db import engine, Base
  File "/database/__init__.py", line 3, in <module>
    from . import db
  File "/database/db.py", line 12, in <module>
    raise ValueError(
ValueError: ❌ DATABASE_URL n'est pas définie dans le fichier d'environnement sélectionné
```
