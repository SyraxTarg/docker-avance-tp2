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