# 📁  MyCloud - Облачное хранилище файлов

<img src="./demo/1-intro/1-1-intro.gif" width="100%">

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
   - Максимальный лимит: 100GB

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

## 2. Особенности работы приложения

### 2.1. Регистрация и вход в приложение

- Выбор раздела "Регистрация" и регистрация. После регистрации пользователя перебросит в хранилище
- Вход по логину и паролю через раздел "Вход"
- ```accounts_customuser``` - таблица из БД, фиксирующая пользователей и админов

<img src="./demo/2-functionality/1-auth.gif" width="100%">

### 2.2. Работа с хранилищем

- Перетаскивание файлов в область (Drag and Drop) или выбор файла (кнопка "Выбрать файл")
- Написание комментария к файлу (необязательно) и загрузка файла в хранилище пользователя. Комментарий можно редактировать
- Скачивание файла, его передача по ссылке и удаление из хранилища пользователя
- Стандартный максимальный размер хранилища для админов и пользователей задается в ```settings.py``` (раздел "Storage Quotas"). При возникновении должной потребности админ может увеличить/уменьшить размер хранилища для конкретного пользователя
- ```storage_userfile``` - таблица из БД, фиксирующая файлы пользователей и админов

<img src="./demo/2-functionality/2-storage.gif" width="100%">

### 2.3. Работа с панелью администратора

- Админ вправе создать нового админа и изменить собственный пароль
- Администратор может деактивировать обычного пользователя, изменить его пароль и объем хранилища в ГБ, удалить его из БД
- Вместе с админ-панелью администраторы будут иметь собственное хранилище для хранения рабочих файлов (руководство администратора, шаблоны ответов на вопросы пользователей и т.п.). Принцип работы хранилища такой же как у обычных пользователей приложения

<img src="./demo/2-functionality/3-admin-panel.gif" width="100%">

## 3. Инструкция по локальному запуску проекта

### 3.1. Клонирование репозитория

* Клонирование репозитория:

```bash
git clone https://github.com/maxter9595/MyCloudApp.git
cd MyCloudApp
```

<img src="./demo/3-local-setup/1-git-clone.gif" width="100%">

### 3.2. Настройка переменных окружения

* Копирование переменных окружения из env_example:

```bash
cp backend/.env_example backend/.env
cp frontend/.env_example frontend/.env
```

<img src="./demo/3-local-setup/2-env-setup.gif" width="100%">

### 3.3. Установка зависимостей и тестирование фронтенда

* Сборка фронтенда и его тестирование:

```bash
cd frontend
npm install
npm run build
npm test
cd ..
```

<img src="./demo/3-local-setup/3-frontend.gif" width="100%">

### 3.4. Запуск Docker

* Запуск Docker Desktop. Его наличие необходимо

* Сборка и запуск Docker:

```bash
docker-compose up --build -d
```

<img src="./demo/3-local-setup/4-docker.gif" width="100%">

### 3.5. Настройка администратора и тестирование бэкенда

* Создание администратора:

```bash
docker-compose ps
docker-compose exec backend python manage.py createsuperuser
```

* Пример данных администратора:

```
Логин: admin
Email: admin@mail.ru
Пароль: Admintest3273!
```

* Тестирование бэкенда:

```bash
docker-compose exec backend python manage.py test
```

<img src="./demo/3-local-setup/5-admin.gif" width="100%">

### 3.6. Подключение к административной панели СУБД PostgreSQL

* Ссылка для подключения: [http://localhost:5050/](http://localhost:5050/)

* Данные администратора БД для входа в административную панель PostgreSQL:

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

* Ключевые таблицы приложения из БД - `accounts_customuser` и `storage_userfile`

<img src="./demo/3-local-setup/6-PostgreSQL.gif" width="100%">

### 3.7. Открытие приложения

* Ссылка для открытия приложения: [http://localhost:3000/](http://localhost:3000/)

* Возможные проблемы:
   - Ошибки портов: убедитесь, что задействованные в приложении порты не заняты
   - PGAdmin не подключается к БД: проверьте, что контейнер `db` запущен (`docker-compose ps`)
   - Проблемы с зависимостями: удалите папки `node_modules/` и `venv/`, затем пересоберите проект

<img src="./demo/3-local-setup/7-app-check.gif" width="100%">

## 4. Инструкция по деплою проекта на сервере

### 4.1. Покупка сервера и подключение к нему

* Рег.RU - Облачный сервер с предустановленным Docker: [https://www.reg.ru/cloud/docker](https://www.reg.ru/cloud/docker)

* Пример IP-адреса и информация о сервере для покупки:

```
- Предустановленный Docker: да 
- Образ: Ubuntu
- Тарифы и конфигурации: производительный
- Тариф: HP C2-M2-D40
- Регион размещения: Москва
- Плавающий (публичный) IP-адрес: да
- Резервное копирование: да
```

* Вход на сервер после его приобретения:

```bash
# Входим по IP и паролю, выданными на почту
ssh root@95.163.220.37
```

<img src="./demo/4-server-deploy/1-server-entrance.gif" width="100%">

### 4.2. Подготовка сервера для деплоя

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

* Запуск Docker:

```bash
# На выбранном сервере Docker уже предустановлен
systemctl enable docker
systemctl start docker
```

* Добавление пользователя в группу docker и его переподключение на сервер для утверждения прав:

```bash
usermod -aG docker myclouduser
exit

# Входим по паролю, заданному пользователю через adduser myclouduser
ssh myclouduser@95.163.220.37
```

<img src="./demo/4-server-deploy/2-server-preparation.gif" width="100%">

### 4.3. Клонирование репозитория. Подготовка бэкенда для деплоя

* Клонирование репозитория:

```bash
git clone https://github.com/maxter9595/MyCloudApp.git
cd MyCloudApp
```

* Настройка ```entrypoint.sh``` в роли исполняемого файла:

```bash
cd backend
chmod +x entrypoint.sh
cd ..
```

* Редактирование переменных окружения для бэкенда:

```bash
cp backend/.env_example backend/.env
sudo nano backend/.env
```

```bash
----- backend/.env -----
# Добавляем my-ip-address (например, 95.163.220.37)
ALLOWED_HOSTS=127.0.0.1,localhost,backend,mycloudapp.local,my-ip-address

....

# Добавляем http://my-ip-address (например, http://95.163.220.37)
CORS_ALLOWED_ORIGINS=http://my-ip-address,http://localhost:3000,http://127.0.0.1:3000,http://frontend:80
CSRF_TRUSTED_ORIGINS=http://my-ip-address,http://localhost:3000,http://127.0.0.1:3000,http://frontend:80
----- backend/.env -----
```

<img src="./demo/4-server-deploy/3-git-clone-and-backend.gif" width="100%">

### 4.4. Подготовка фронтенда для деплоя

* Редактирование переменных окружения для фронтенда:

```bash
cp frontend/.env_example frontend/.env
sudo nano frontend/.env
```

```
----- backend/.env -----
# Добавляем серверный IP вместо my-ip-address
REACT_APP_API_BASE_URL=http://my-ip-address:8000/api
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

* Установка прав на родительские директории и чтение файлов:

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

<img src="./demo/4-server-deploy/4-frontend.gif" width="100%">

### 4.5. Запуск Docker. Создание администратора

* Сборка и запуск Docker:

```bash
cd ~/MyCloudApp
docker compose build
docker compose up -d
```

<img src="./demo/4-server-deploy/5-1-docker.gif" width="100%">

* Проверка наличия Docker контейнеров и создание администратора:

```bash
docker compose ps
docker compose exec backend python manage.py createsuperuser
```

* Данные администратора (пример):

```
Логин: admin
Email: admin@mail.ru
Пароль: Admintest3273!
```

<img src="./demo/4-server-deploy/5-2-admin.gif" width="100%">

### 4.6. Настройка Nginx

* Настройка ```nginx/sites-available```:

```bash
sudo cp .nginx-site_example /etc/nginx/sites-available/mycloud
sudo nano /etc/nginx/sites-available/mycloud
```

```bash
----- sites-available/mycloud -----
# Корректирем my-ip-address под конкретный IP-адрес (например, 95.163.220.37)
server {
    listen 80;
    server_name my-ip-address;
    ... 
----- sites-available/mycloud -----
```

* Настройка конфигурации Nginx:

```bash
sudo nano /etc/nginx/nginx.conf
```

```bash
---------- nginx.conf ----------
# Добавление client_max_body_size в http
http {
    client_max_body_size 2G; 
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

<img src="./demo/4-server-deploy/6-nginx.gif" width="100%">

### 4.7. Открытие приложения

* Доступ к приложению:
   - Фронтенд: [http://95.163.220.37/](http://95.163.220.37/)
   - Бэкенд: [http://95.163.220.37:8000/api/docs/](http://95.163.220.37:8000/api/docs/)
   - Админка PostgreSQL (через PGAdmin): [http://95.163.220.37:5050/](http://95.163.220.37:5050/)

* Данные администратора БД для входа в административную панель СУБД PostgreSQL:

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

<img src="./demo/4-server-deploy/7-app-check.gif" width="100%">

## 5. Настройка автодеплоя проекта (CI/CD)

### 5.1. Генерация SSH-ключа на локальном ПК

* Генерация SSH-ключа на локальном ПК:

```bash
ssh-keygen -t ed25519 -C "max.t95@bk.ru"
```

* Вывод SSH-ключа из локального ПК для копирования:

```bash
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

```bash
# Копируем SSH-ключ
ssh-ed25519 AAAA...jU max.t95@bk.ru
```

<img src="./demo/5-ci-cd/1-local-PC-key-gen.png" width="100%">

### 5.2. Генерация SSH-ключа на сервере

* Вход на сервер:

```bash
ssh myclouduser@95.163.220.37
```

* Генерация SSH-ключа на сервере:

```bash
ssh-keygen -t ed25519 -C "max.t95@bk.ru"
```

* Вывод SSH-ключа из сервера для просмотра:


```bash
ssh-keygen -y -f ~/.ssh/id_ed25519
```

```bash
# SSH-ключ из сервера понадобится для удаленного подключения к GitHub
ssh-ed25519 AAAA...rx max.t95@bk.ru
```

<img src="./demo/5-ci-cd/2-server-key-gen.png" width="100%">

### 5.3. Добавление SSH-ключей из локального ПК и сервера в список авторизованных ключей сервера

* Ввод SSH-ключа из сервера в список авторизированных ключей:

```bash
ssh-keygen -y -f ~/.ssh/id_ed25519 >> ~/.ssh/authorized_keys
```

* Ввод SSH-ключа из локального ПК в список авторизированных ключей:

```bash
echo "ssh-ed25519 AAAA...jU max.t95@bk.ru" >> ~/.ssh/authorized_keys
```

* Просмотр списка авторизированных ключей:

```bash
cat ~/.ssh/authorized_keys
```

```bash
# В итоге должно быть два SSH-ключа в списке авторизованных ключей
ssh-ed25519 AAAA...rx max.t95@bk.ru
ssh-ed25519 AAAA...jU max.t95@bk.ru
```

<img src="./demo/5-ci-cd/3-authorized-keys-list.png" width="100%">

### 5.4. Настройка sudo без пароля для CI/CD


* Настройка прав для authorized_keys:

```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```


* Вход в visudo и добавление параметров для обхода паролей пользователя при деплое:  

```bash
sudo visudo
```

```bash
# Добавляем в конце файла следующее:
myclouduser ALL=(ALL) NOPASSWD: ALL
```

* Выход из сервера и проверка входа на сервер без пароля:

```bash
exit
ssh myclouduser@95.163.220.37
# Если всё ок — войдём без пароля
```

<img src="./demo/5-ci-cd/4-no-pass-setup.gif" width="100%">

### 5.5. Привязка SSH-ключа к GitHub

* Вывод публичного SSH-ключа для взаимодействия с GitHub:

```bash
cat ~/.ssh/id_ed25519.pub
```

```bash
# Копируем все, что будет выведено
ssh-ed25519 AAAA...rx max.t95@bk.ru
```

* Настройка публичного ключа к GitHub:

   * ```Сайт GitHub``` → ```Settings``` → ```SSH and GPG keys``` → ```New SSH key```. Заполняем параметры SHH-ключа:

     * Тип ключа: ```Authentication Key``` 
  
     * Имя ключа: ```VM-server```

     * В поле ```Key``` добавляем содержимое SSH-ключа. Пример - ```ssh-ed25519 AAAA...rx max.t95@bk.ru```

  * После добавления параметров SSH-ключа нажимаем ```Add SSH key```

<img src="./demo/5-ci-cd/5-SSH-key-integration-with-github.png" width="100%">

### 5.6.Настройка файла SSH-конфигурации. Проверка подключения к GitHub

* Внесение GitHub в список известных хостов сервера:

```bash
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
```

* Настройка конфигурации для SSH:

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

* Задание прав для файла SSH-конфигурации:

```bash
chmod 600 ~/.ssh/config
```

* Проверка взаимодействия с GitHub:

```bash
ssh -T git@github.com
# Если всё ок — увидим это сообщение:
# Hi <логин>! You've successfully authenticated ...
```

<img src="./demo/5-ci-cd/6-github-integration-check.gif" width="100%">

### 5.7. Установка значений secret-параметров GitHub-репозитория для автодеплоя

* Ввод команды на сервере для получения ```SSH_PRIVATE_KEY```:

```bash
cat ~/.ssh/id_ed25519
```

```bash
# Копируем все вместе с комментариями BEGIN и END
-----BEGIN OPENSSH PRIVATE KEY----- 
b3...= 
-----END OPENSSH PRIVATE KEY-----
```

* Ввод secrets для автодеплоя GitHub-репозитория:

  * SSH_HOST: ```95.163.220.37``` (или другой IP-адрес сервера)

  * SSH_USER: ```myclouduser```

  * SSH_PRIVATE_KEY: результат команды ```cat ~/.ssh/id_ed25519``` на сервере

<img src="./demo/5-ci-cd/7-1-secrets.png" width="100%">

* После установки secrets проверяем функционал автодеплоя

<img src="./demo/5-ci-cd/7-2-auto-deploy.gif" width="100%">
