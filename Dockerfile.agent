FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod ./
# COPY go.sum ./
# go.sum might not exist yet if dependencies aren't finalized, but let's assume simple build.
RUN go mod download

COPY . .

RUN go build -o monitor-app

# Final stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/monitor-app .
# We expect config.json to be mounted via volume

CMD ["./monitor-app"]
