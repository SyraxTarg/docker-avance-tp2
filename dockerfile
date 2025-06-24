FROM debian:stable

RUN adduser rally


# Workdir commun
WORKDIR /app

# Install des dépendances communes
RUN apt-get update && \
    apt-get install -y python && \
    apt-get clean


USER rally

# build for dev
FROM python:3.11-slim AS dev

RUN adduser rally

USER rally

VOLUME [ "./src/rally-main/rally_back"]

COPY ./requirements.txt .

RUN pip install --upgrade pip && pip install -r ./requirements.txt && pip cache purge

ENV ENVIRONMENT=development

LABEL com.rally.author="SyraxTarg" \
    com.rally.vendor="SyraxTarg" \
    com.rally.source="https://github.com/SyraxTarg/docker-avance-tp2"

CMD ["python", "main.py"]


# build for prod
FROM python:3.11-slim AS prod

RUN adduser rally

USER rally

COPY ./src/rally-main/rally_back . \
    ./requirements.txt ./

RUN pip install --upgrade pip && pip install -r ./requirements.txt && pip cache purge

ENV ENVIRONMENT=production

LABEL com.rally.author="SyraxTarg" \
    com.rally.vendor="SyraxTarg" \
    com.rally.source="https://github.com/SyraxTarg/docker-avance-tp2"

ENTRYPOINT ["python", "main.py"]