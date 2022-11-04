from confluent_kafka import Consumer
import time

################

c = Consumer(
    {
        "bootstrap.servers": "localhost:9092",
        "group.id": "python-consumer",
        "auto.offset.reset": "earliest",
    }
)

print("Available topics to consume: ", c.list_topics().topics)

c.subscribe(["topic1"])

################


def main():
    consumer_start = time.time()
    msg_consumed_count = 0
    msg_count = 100
    while True:
        msg = c.poll(1.0)  # timeout
        if msg:
            msg_consumed_count += 1
            print(msg_consumed_count)
        if msg is None:
            continue
        if msg.error():
            print("Error: {}".format(msg.error()))
            continue
        if msg_consumed_count == msg_count:
            break
        data = msg.value().decode("utf-8")
        print(data)
    c.close()
    print(time.time() - consumer_start)


if __name__ == "__main__":
    main()
