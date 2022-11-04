from faker import Faker
from confluent_kafka import Producer, Consumer
import logging
import random
import json
import time


def receipt(err, msg):
    logging.basicConfig(
        format="%(asctime)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        filename="producer.log",
        filemode="w",
    )
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    if err is not None:
        print("Error: {}".format(err))
    else:
        message = "Produced message on topic {} with value of {}\n".format(
            msg.topic(), msg.value().decode("utf-8")
        )
        logger.info(message)
        print(message)


def produce(nb_record, topic_name):
    fake = Faker()
    for i in range(nb_record):
        data = {
            "user_id": fake.random_int(min=20000, max=100000),
            "user_name": fake.name(),
            "user_address": fake.street_address()
            + " | "
            + fake.city()
            + " | "
            + fake.country_code(),
            "platform": random.choice(["Mobile", "Laptop", "Tablet"]),
            "signup_at": str(fake.date_time_this_month()),
        }
        p = Producer({"bootstrap.servers": "localhost:9092"})
        m = json.dumps(data)
        p.poll(1)
        p.produce(topic_name, m.encode("utf-8"), callback=receipt)
        p.flush()


def consumer(nb_message, tobic_name):
    list_message = []
    c = Consumer(
        {
            "bootstrap.servers": "localhost:9092",
            "group.id": "python-consumer",
            "auto.offset.reset": "earliest",
        }
    )
    c.subscribe([tobic_name])
    msg_consumed_count = 0
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
        if msg_consumed_count == nb_message:
            print("yes")
            break
        data = msg.value().decode("utf-8")
        list_message.append(data)
        print("*************")
        print(data)
    c.close()
    return list_message


def main():
    produce(5, "topic1")
    produce(4, "topic2")
    produce(3, "topic3")
    time.sleep(5)
    consumer(5, "topic1")
    consumer(4, "topic2")
    consumer(3, "topic3")


if __name__ == "__main__":
    main()
