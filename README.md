# 🧠 Zsolt Csengeri — FastAPI + PostgreSQL + Nginx Deployment Project

## 🌍 Live Demo
| Environment | URL |
|--------------|-----|
| **Frontend (Website)** | https://zsolt-csengeri.com |
| **Backend (API Endpoint)** | https://api.zsolt-csengeri.com/contacts |

---

## 🧩 Overview
This is a **fully deployed full-stack web application** demonstrating how to build, connect, and serve a FastAPI backend and PostgreSQL database behind a secure Nginx reverse proxy with valid SSL certificates.

The project runs on **DigitalOcean**, uses a **custom domain** from Namecheap, and includes a production-ready folder structure.

---

## 🏗️ Architecture
```
/fastapi-app
├── backend/
│   ├── main.py          # FastAPI app entrypoint
│   ├── database.py      # PostgreSQL connection via SQLAlchemy
│   ├── models.py        # ORM model(s)
│   ├── requirements.txt # Dependencies
│
├── frontend/
│   ├── index.html       # Frontend UI
│   ├── script.js        # Handles API POST requests to backend
│   ├── style.css        # Layout and design
│   ├── CV/              # Static assets (CV PDF)
│
└── venv/                # Python virtual environment
```
---

## ⚙️ Tech Stack
| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | FastAPI, Uvicorn |
| **Database** | PostgreSQL |
| **Web Server / Proxy** | Nginx |
| **SSL & HTTPS** | Let’s Encrypt + Certbot |
| **Hosting** | DigitalOcean Droplet (Ubuntu) |
| **Domain** | Namecheap (DNS: A & CNAME records) |

---

## 🚀 Deployment Steps (Summary)

1. **Provision Ubuntu Droplet**
```bash
ssh root@<server_ip>
sudo apt update && sudo apt upgrade -y
```

2. **Install core services**
```bash
sudo apt install python3 python3-venv python3-pip nginx postgresql -y
```

3. **Setup FastAPI backend**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
# (or) pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic[email]
```

4. **Configure PostgreSQL**
```bash
sudo -i -u postgres
psql
CREATE DATABASE cv_site;
CREATE USER cv_app_user WITH PASSWORD 'menzoberanzan';
GRANT ALL PRIVILEGES ON DATABASE cv_site TO cv_app_user;
\\q
exit
```

5. **Run locally for testing**
```bash
uvicorn backend.main:app --reload
```

6. **Setup Nginx for reverse proxy + SSL**
- Create `/etc/nginx/sites-available/zsolt-csengeri.com`
- Link & test:
```bash
sudo ln -s /etc/nginx/sites-available/zsolt-csengeri.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
- Issue certificates:
```bash
sudo certbot --nginx -d zsolt-csengeri.com -d www.zsolt-csengeri.com
```

7. **Fix permission issue (if 500)**
```bash
sudo chmod o+x /home/zsolt
sudo chown -R www-data:www-data /home/zsolt/fastapi-app/frontend
sudo systemctl reload nginx
```

---

## ✅ Test Scenarios

| Test | URL / Result |
|------|---------------|
| 🖥️ Frontend loaded successfully | `https://zsolt-csengeri.com` |
| 📨 Form submission | Sends data to `https://api.zsolt-csengeri.com/contacts` |
| 📊 Database insert | Verified in PostgreSQL with `SELECT * FROM contacts;` |
| 🔒 SSL certificates | Issued by Let’s Encrypt (auto-renew enabled) |

---

## 🧾 Common Errors & Fixes

| Error | Cause | Fix |
|--------|--------|-----|
| `404 Not Found` | Wrong root path or missing index.html | Check Nginx `root` path |
| `500 Internal Server Error` | File permission denied | `sudo chmod o+x /home/zsolt` and `chown` frontend to `www-data` |
| `ERR_SSL_PROTOCOL_ERROR` | SSL not configured | Run `sudo certbot --nginx ...` |
| `Invalid response from /.well-known/acme-challenge` | DNS not propagated | Wait or verify A records point to droplet IP |
| `Permission denied to /frontend/index.html` | Nginx user lacks access | `sudo chown -R www-data` |

---

## 🧰 Useful Commands

```bash
# Restart Nginx
sudo systemctl reload nginx

# Check logs
sudo tail -n 50 /var/log/nginx/error.log

# Check FastAPI logs (systemd)
sudo journalctl -u fastapi -n 50

# PostgreSQL access
sudo -i -u postgres
psql
\\c cv_site
SELECT * FROM contacts;
\\q
```

---

## 📖 Author
**Zsolt Csengeri**  
Solution Engineer • Python & Linux • Cloud & DevOps  
📧 zsoltcsengeri@yahoo.com  
🌐 https://zsolt-csengeri.com
