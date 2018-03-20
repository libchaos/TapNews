from CloudAMQP_client import CloudAMQPClient

CloudAMQP_URL = 'amqp://vcngkxuu:545hz305b9_ZPRFuTXK49iOwkD-_SEne@skunk.rmq.cloudamqp.com/vcngkxuu'
QUEUE_NAME = 'test'

def test_basic():
    client = CloudAMQPClient(CloudAMQP_URL, QUEUE_NAME)
    sendMsg = {'test': 'success'}
    client.sendMessage(sendMsg)
    client.sleep(2)
    assert client.getMessage() == sendMsg
    print 'cloudAMQP connection success'

if __name__ == "__main__":
    test_basic()