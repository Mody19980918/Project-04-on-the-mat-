select DISTINCT classes.name,
    classes.type as type,
    teachers.name as teacher_name,
    studio.name as studio_name,
    images.path as path,
    classes.start_time as time,
    classes_interval.date as date
from classes
    join studio on studio.id = classes.studio_id
    join teachers on teachers.id = classes.teacher_id
    join images on images.class_id = classes.id
    left join classes_interval on classes_interval.classes_id = classes.id
where classes.name ilike '%?%';