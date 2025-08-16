# MyCloud - Облачное хранилище файлов

## 1. API Документация

### Основные эндпоинты

#### Аутентификация

| Метод | Путь                   | Описание                          | Лимиты               |
|-------|------------------------|-----------------------------------|----------------------|
| POST  | `/api/auth/register/`    | Регистрация нового пользователя   | 50 запросов/час      |
| POST  | `/api/auth/login/`       | Вход в систему                   | 50 запросов/час      |
| POST  | `/api/auth/logout/`      | Выход из системы                 | Без лимитов          |
| GET   | `/api/auth/users/me/`    | Получение данных текущего пользователя | 1000 запросов/час |

#### Работа с файлами

| Метод | Путь                          | Описание                          | Лимиты               |
|-------|-------------------------------|-----------------------------------|----------------------|
| GET   | `/api/storage/files/`           | Получение списка файлов           | 100 запросов/мин     |
| POST  | `/api/storage/files/`           | Загрузка нового файла             | Макс. размер 2GB     |
| GET   | `/api/storage/files/{id}/`      | Получение информации о файле      | 100 запросов/мин     |
| DELETE| `/api/storage/files/{id}/`      | Удаление файла                    | 50 запросов/час      |
| GET   | `/api/storage/files/{id}/download/` | Скачивание файла              | 50 запросов/час      |
| GET   | `/api/storage/shared/{link}/`   | Скачивание по публичной ссылке    | 100 запросов/час     |

#### Администрирование

| Метод | Путь                   | Описание                          | Лимиты               |
|-------|------------------------|-----------------------------------|----------------------|
| GET   | `/api/auth/users/`       | Список пользователей (только админ) | 100 запросов/час  |
| POST  | `/api/auth/admin/create/`| Создание администратора           | 10 запросов/час      |

### Лимиты API

1. **Размер файлов**:
   - Максимальный размер загружаемого файла: 2GB
   - Минимальный размер: 1KB

2. **Квоты хранилища**:
   - Обычные пользователи: 5GB по умолчанию
   - Администраторы: 10GB по умолчанию
   - Минимальный лимит: 1MB
   - Максимальный лимит: 100GB (только для админов)

3. **Ограничения запросов**:
   - Анонимные запросы: 100/день
   - Авторизованные пользователи: 500000/час
   - Регистрация/логин: 5000/час

4. **Ограничения для файлов**:
   - Максимальное количество полей в форме: 1000
   - Максимальное количество файлов за раз: 20

### Интерактивная документация

1. **Swagger UI** - интерактивный просмотр и тестирование API:
   - URL: `/api/docs/`

2. **ReDoc** - альтернативное представление документации:
   - URL: `/api/redoc/`

### Доступ к схеме API

Для разработчиков доступна raw-схема API в формате OpenAPI:

- URL: `/api/schema/`
  - Формат: `YAML/JSON`

## 2. Инструкция по локальному запуску проекта

### 2.1. Клонирование репозитория

* Клонирование репозитория:

```bash
git clone https://github.com/maxter9595/MyCloudApp.git
cd MyCloudApp
```

### 2.2. Настройка переменных окружения

* Формирование переменных окружения:

```bash
cp backend/.env_example backend/.env
cp frontend/.env_example frontend/.env
```

### 2.3. Установка зависимостей и тестирование (фронтенд)

* Сборка фронтенда и тестирование фронтовой части:

```bash
cd frontend
npm install
npm run build
npm test
cd ..
```

### 2.4. Запуск Docker

* Запускаем Docker Desktop

* Сборка проекта в Docker:

```bash
docker-compose up --build -d
```

* После запуска миграций и сборки Docker появятся следующие обычные пользователи (заданы в ```0002_add_mortal_kombat_users.py```): 

```
# User 1
username: scorpion123
password': GetOverHere!123

# User 2
username: subzero456
password': IceClone$456

# User 3
username: liukang789
password: BicycleKick*789

# User 4
username: raiden321
password: GodOfThunder#321

# User 5
username: johnnyc654
password: HollywoodStar@654

# User 6
username: sonya987
password: MilitaryGrade!987

# User 7
username: jax567
password: MetalArms$567

# User 8
username: kitana890
password: FanOfDeath%890
```

### 2.5. Настройка администратора и тестирование (бэкенд)

* Создание администратора:

```bash
docker-compose ps
docker-compose exec backend python manage.py createsuperuser
```

* Данные администратора:

```
Логин: admin
Email: admin@mail.ru
Пароль: Admintest3273!
```

* Тестирование бэкенда:

```bash
docker-compose exec backend python manage.py test
```

### 2.6. Подключение к административной панели СУБД PostgreSQL

* Ссылка для подключения: [http://localhost:5050/](http://localhost:5050/)

* Данные администратора БД для входа в админку PostgreSQL:

```
Почта: admin@example.com
Пароль: admin123
```

* `Register...` ➝ `Server...`. Данные соединения:

```
Host: db
Port: 5432
Maintenance database: my_database
Username: postgres
Password: postgres
```

* Ключевые таблицы приложения из БД: `accounts_customuser`, `storage_userfile`

### 2.7. Открытие приложения

* Ссылка для открытия приложения: [http://localhost:3000/](http://localhost:3000/)

* Возможные проблемы:
   - Ошибки портов: убедитесь, что задействованные в приложении порты не заняты
   - PGAdmin не подключается к БД: проверьте, что контейнер `db` запущен (`docker-compose ps`)
   - Проблемы с зависимостями: удалите папки `node_modules/` и `venv/`, затем пересоберите проект

## 3. Инструкция по деплою проекта на облачном сервере

### 3.1. Покупка сервера и подключение к нему

* Рег.RU - Облачный сервер с предустановленным Docker: [https://www.reg.ru/cloud/docker](https://www.reg.ru/cloud/docker)

* Пример IP-адреса и информация о сервере для покупки:

```
- Предустановленный Docker: да 
- IP адрес: 194.67.84.52
- Образ: Ubuntu
- Тарифы и конфигурации: производительный
- Тариф: HP C2-M2-D40
- Регион размещения: Москва
- Плавающий (публичный) IP-адрес: да
- Резервное копирование: да
```

Вход на сервер:

```bash
ssh root@194.67.84.52
# Входим по паролю, выданному на почту
```

### 3.2. Подготовка сервера для деплоя

* Создание пользователя и добавление его в группу sudo:

```bash
adduser myclouduser
usermod -aG sudo myclouduser
```

* Установка зависимостей:

```bash
apt update && apt upgrade -y
apt install -y git nginx ufw
```

* Настройка firewall:

```bash
sudo ufw allow 3000
sudo ufw allow 8000
sudo ufw allow 5050
ufw allow 22
ufw allow 80
ufw enable
```

* Запуск Docker (на сервере он уже предустановлен):

```bash
systemctl enable docker
systemctl start docker
```

* Добавление пользователя в группу docker и переподключение для утверждения прав:

```bash
usermod -aG docker myclouduser
exit
ssh myclouduser@194.67.84.52
# Входим по паролю, заданному пользователю изначально через adduser myclouduser
```

### 3.3. Клонирование проекта. Подготовка бэкенда для деплоя

* Клонирование репозитория:

```bash
git clone https://github.com/maxter9595/MyCloudApp.git
cd MyCloudApp
```

* Настройка entrypoint в роли исполняемого файла (на всякий случай):

```bash
chmod +x backend/entrypoint.sh
```

* Редактирование переменных окружения для бэкенда:

```bash
cp backend/.env_example backend/.env
sudo nano backend/.env
```

```
----- backend/.env -----
ALLOWED_HOSTS=127.0.0.1,localhost,backend,mycloudapp.local,194.67.84.52 # Добавляем IP-адрес сервера
....
CORS_ALLOWED_ORIGINS=http://194.67.84.52:3000 # Добавляем IP-адрес сервера
----- backend/.env -----
```

### 3.4. Подготовка фронтенда для деплоя

* Редактирование переменных окружения для фронтенда:

```bash
cp frontend/.env_example frontend/.env
sudo nano frontend/.env
```

```
----- backend/.env -----
REACT_APP_API_BASE_URL=http://194.67.84.52:8000/api # Добавляем IP-адрес сервера
----- backend/.env -----
```

* Установка зависимостей для фронтенда:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* Сборка проекта:

```bash
cd frontend
npm install
npm run build
```

* Права на родительские директории и чтение файлов:

```bash
sudo chmod o+x /home/myclouduser
sudo chmod o+x /home/myclouduser/MyCloudApp
sudo chmod o+x /home/myclouduser/MyCloudApp/frontend
sudo chmod o+x /home/myclouduser/MyCloudApp/frontend/build
```

* Смена группы на www-data:

```bash
sudo chmod -R o+r /home/myclouduser/MyCloudApp/frontend/build
sudo chown -R myclouduser:www-data /home/myclouduser/MyCloudApp/frontend/build
sudo chmod -R 750 /home/myclouduser/MyCloudApp/frontend/build
```

### 3.5. Запуск проекта с сервисами

* Запуск проекта на сервере с Docker сервисами:

```bash
cd ~/MyCloudApp
docker compose build
docker compose up -d
```

* Проверка наличия Docker контейнеров и настройка администратора:

```bash
docker compose ps
docker compose exec backend python manage.py createsuperuser
```

* Данные администратора:

```
Логин: admin
Email: admin@mail.ru
Пароль: Admintest3273!
```


### 3.6. Конфигурация Nginx

* Настройка nginx/sites-available под определенный IP адрес:

```bash
sudo cp .nginx-site_example /etc/nginx/sites-available/mycloud
sudo nano /etc/nginx/sites-available/mycloud
```

```
----- sites-available/mycloud -----
server {
    listen 80;
    server_name 194.67.84.52; # Добавление IP-адреса сервера
    ... 
----- sites-available/mycloud -----
```

* Настройка конфигурации Nginx:

```bash
sudo nano /etc/nginx/nginx.conf
```

```
---------- nginx.conf ----------
http {
    client_max_body_size 2G;  # Добавление client_max_body_size в http
    ...
}
---------- nginx.conf ----------
```

* Загрузка конфигурации Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/mycloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3.7. Открытие приложения

* Доступ к приложению:
   - Фронтенд: [http://194.67.84.52/](http://194.67.84.52/)
   - Бэкенд: [http://194.67.84.52:8000/api/docs/](http://194.67.84.52:8000/api/docs/)
   - Админка PostgreSQL (через PGAdmin): [http://194.67.84.52:5050/](http://194.67.84.52:5050/)

* Данные администратора БД для входа в админку PostgreSQL:

```
Почта: admin@example.com
Пароль: admin123
```

* `Register...` ➝ `Server...`. Данные соединения к БД в СУБД PostgreSQL:

```
Host: db
Port: 5432
Maintenance database: my_database
Username: postgres
Password: postgres
```

## 4. Настройка автодеплоя проекта (CI/CD)

* **Примечание**: инструкция по получению SSH-ключа приводится для пользователей Windows. В случае ОС Linux следует почитать эту статью из habr.com: [https://habr.com/ru/articles/897654/](https://habr.com/ru/articles/897654/)

### 4.1. Создание публичного SSH-ключа и его копирование

* Создание публичного SSH-ключа:

```bash
ssh-keygen -t ed25519 -C "max.t95@bk.ru"
# max.t95@bk.ru - пример почты
```

* Ручное копирование публичного SSH-ключа:

```bash
type $env:USERPROFILE\.ssh\id_ed25519.pub
# ssh-ed25519 AAAA...Vvtb max.t95@bk.ru
# AAAA...Vvtb - пример выведенного ключа. Его нужно скопировать
```

### 4.2. Добавление скопированного публичного SHH-ключа на сервере

* Добавление ключа на сервер:

```bash
ssh myclouduser@194.67.84.52
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAA...Vvtb max.t95@bk.ru" >> ~/.ssh/authorized_keys
# AAAA...Vvtb - публичный SSH-ключ, полученный ранее
```

* Настраиваем права доступа к ключам:

```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

* Выходим из сервера и проверяем вход на сервер без пароля:

```bash
exit
ssh myclouduser@194.67.84.52
# Если всё ок — войдём без пароля.
```

### 4.3. Привязка публичного SHH-ключа к GitHub

* `Сайт GitHub` → `Settings` → `SSH and GPG keys` → `New SSH key`. Заполняем параметры SHH-ключа:

  - В поле `Key` добавляем всю информацию о публичном SSH-ключе. Пример подобной информации - `ssh-ed25519 AAAA...Vvtb max.t95@bk.ru` 
  
  - Тип ключа - `Authentication Key`, имя ключа - `VM-server`
  
* После задания всех параметров для SSH ключа нажимаем `Add SSH key`

### 4.4. Настройка конфигурации SSH и проверка аутентификации на GitHub на сервере

* Добавление GitHub в known_hosts:

```bash
ssh myclouduser@194.67.84.52
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
```

* Создание и настройка конфигурации SSH:

```bash
nano ~/.ssh/config
```

```
----- ~/.ssh/config -----
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
----- ~/.ssh/config -----
```

* Настройка прав доступа:

```bash
chmod 600 ~/.ssh/config
```

* Проверка подключения:

```bash
ssh -T git@github.com
# Если всё ок — увидим это сообщение:
# Hi <твой_логин>! You've successfully authenticated ...
```

### 4.5. Готовим secrets для работы с GitHub Actions

* ```SSH_HOST```: 91.197.96.117

* ```SSH_USER```: myclouduser


* `SSH_PRIVATE_KEY`:

```bash
cat ~/.ssh/id_ed25519
```

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3Bl....ucnU=
-----END OPENSSH PRIVATE KEY-----
```

###### Из результата копируем все, включая ```-----BEGIN OPENSSH PRIVATE KEY-----``` и ```-----END OPENSSH PRIVATE KEY----```. Скопированное сообщение - секретный ключ `SSH_PRIVATE_KEY`

* `KNOWN_HOSTS`:

```bash
ssh-keyscan -H 194.67.84.52
```

###### Копируем все строки, начинающиеся с ```|1|...``` (хэшированные записи) и ```AAAA...``` (отпечатки ключей). Пример итоговой записи для ключа представлен ниже. Это и будет `KNOWN_HOSTS`

```
|1|qZ...k= ecdsa-sha2-nistp256 AAAA...Y=
|1|AU...Cg= ssh-ed25519 AAAA...wZ
|1|TA...Kw= ssh-rsa AAAA...1c=
```

### 4.6. Подставляем secrets для работы с GitHub Actions

* ```GitHub-репозиторий проекта``` → ```Settings``` → ```Secrets and variables``` → ```Actions```. Задаем все secret-переменные, зафиксированные ранее:

   * ```SSH_HOST```: 91.197.96.117

   * ```SSH_USER```: myclouduser

   * `SSH_PRIVATE_KEY`:

      ```
      -----BEGIN OPENSSH PRIVATE KEY-----
      b3Bl....ucnU=
      -----END OPENSSH PRIVATE KEY-----
      ```

  * `KNOWN_HOSTS`:

      ```
      |1|qZ...k= ecdsa-sha2-nistp256 AAAA...Y=
      |1|AU...Cg= ssh-ed25519 AAAA...wZ
      |1|TA...Kw= ssh-rsa AAAA...1c=
      ```

### 4.7. Проверяем работу GitHub Actions

* Пушим последние изменения в репозиторий и смотрим на работу GitHub Actions
