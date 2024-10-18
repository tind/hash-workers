FROM ubuntu:24.10

SHELL ["/bin/bash", "-c"]

COPY ./host_uid ./host_gid /tmp/

RUN <<EOF
apt-get update
apt-get upgrade --yes
apt-get install --yes --no-install-recommends \
    sudo \
    git \
    curl \
    ca-certificates \
    vim \
    build-essential \
    pkg-config \
    nodejs \
    npm
apt-get clean --yes
rm -rf /var/lib/apt/lists/*
EOF

RUN <<EOF
current_group_name=$(getent group | grep ":"$(cat /tmp/host_gid)":$" | cut -d: -f1)

if [ ! -z "$current_group_name" ]; then
    groupmod --gid 1234 $current_group_name
fi

addgroup --gid $(cat /tmp/host_gid) ubuntu
adduser --uid $(cat /tmp/host_uid) --gid $(cat /tmp/host_gid) --disabled-password --gecos "" ubuntu
usermod --append --groups sudo ubuntu

echo '%sudo ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/sudo-nopasswd
EOF

USER ubuntu