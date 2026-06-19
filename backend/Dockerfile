# Go Server Builder
FROM golang:1.20.2-alpine3.17
WORKDIR /home
COPY ./app/ .
RUN go mod tidy && \
    apk update && \
    apk add gcc musl-dev ffmpeg p7zip && \
    rm -f /usr/libexec/gcc/x86_64-alpine-linux-musl/12.2.1/lto1 && \
    rm -f /usr/libexec/gcc/x86_64-alpine-linux-musl/12.2.1/lto-wrapper
EXPOSE 4000
CMD ["go", "run", "main.go"]