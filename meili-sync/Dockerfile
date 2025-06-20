FROM golang:1.22 AS builder

WORKDIR /app
COPY . .

RUN go mod tidy
RUN go build -o exporter

FROM debian:bookworm-slim

WORKDIR /app
COPY --from=builder /app/exporter .

CMD ["./exporter"]
