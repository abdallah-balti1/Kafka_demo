from confluent_kafka import Producer
from faker import Faker
import json
import time
import logging
import sys
import random

fake = Faker()

logging.basicConfig(
    format="%(asctime)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    filename="producer.log",
    filemode="w",
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)

p = Producer({"bootstrap.servers": "localhost:9092"})

#####################


def receipt(err, msg):
    if err is not None:
        print("Error: {}".format(err))
    else:
        message = "Produced message on topic {} with value of {}\n".format(
            msg.topic(), msg.value().decode("utf-8")
        )
        logger.info(message)
        print(message)


#####################
print("Kafka Producer has been initiated...")


def main():
    producer_start = time.time()
    for i in range(1000000):
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
        m = json.dumps(data)
        p.poll(1)
        p.produce("topic1", m.encode("utf-8"), callback=receipt)
        p.flush()
    print(time.time() - producer_start)


if __name__ == "__main__":
    main()
