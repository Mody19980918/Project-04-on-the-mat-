select SUM((read_status = 'false')::int) as amountOfRead_status,
    sender_id
from chat_record
where receiver_id = 1
GROUP BY sender_id