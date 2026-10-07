TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`localhost` trigger huf\nafter insert\non customer\nfor each row \nbegin\ninsert into manager values(new.id,new.username,new.password);\nend'
sql_modes=1098907648
definers='root@localhost'
client_cs_names='utf8mb4'
connection_cl_names='utf8mb4_general_ci'
db_cl_names='utf8mb4_general_ci'
created=1790075629876718
