# Синхронизация на Windows

Как получить всю работу на другом компьютере с Windows и синхронизировать её.

---

## 1. Подготовка (один раз)

### 1.1 Установить Git для Windows

1. Скачай: https://git-scm.com/download/win
2. Установи с настройками по умолчанию
3. Открой **Git Bash** или **PowerShell**

### 1.2 Настроить Git и доступ к GitHub

```bash
git config --global user.name "UntLab | Automation"
git config --global user.email "46091280+UntLab@users.noreply.github.com"
```

**Вариант A — HTTPS (проще):**

```bash
# Будет запрос логина/пароля при первом push/pull
# Рекомендуется: Personal Access Token вместо пароля
# Создать: GitHub → Settings → Developer settings → Personal access tokens
```

**Вариант B — SSH (удобнее после настройки):**

```bash
# Сгенерировать ключ
ssh-keygen -t ed25519 -C "i@2ai.az" -f "$HOME/.ssh/id_ed25519"

# Показать публичный ключ и добавить в GitHub
cat ~/.ssh/id_ed25519.pub
# Скопировать в: GitHub → Settings → SSH and GPG keys → New SSH key
```

---

## 2. Первый клон (новый компьютер)

```bash
# Папка — куда клонировать (подставь свой путь)
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ

# Клон (все проекты в одном репо — submodules не нужны)
git clone https://github.com/UntLab/codex.git progects
cd progects
```

---

## 3. Куда положить проекты на Windows

На Mac структура такая:

- `codex` — центральный workspace и backup hub
- `backups/projects/` — резервные копии отдельных проектов
- `config/` — общие навыки и правила
- `workspace/` — черновики, внутренние утилиты и эксперименты

На Windows проще держать всё внутри клона:

```
C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\progects\
├── backups\
│   └── projects\
│       ├── cardsaas\
│       ├── pharmatech\
│       ├── pharmatech-mobile\
│       ├── home-assistant-dashboard\
│       └── n8n-prompt-manager\
├── workspace\
│   ├── inbox\
│   ├── drafts\
│   ├── experiments\
│   └── internal-tools\
├── config\
│   ├── codex-skills\
│   ├── cursor-skills\
│   └── cursor-rules\
├── docs\
└── scripts\
    ├── sync\
    └── backup\
```

Работай из корня `progects`, а backup-копии отдельных репозиториев считай резервными, а не основными рабочими каталогами.

---

## 4. Синхронизация (каждый день / после работы)

### Скачать изменения с GitHub (pull)

```bash
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\progects
bash ./scripts/sync/direct-pull.sh main
```

### Отправить изменения на GitHub (push)

```bash
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\progects
bash ./scripts/sync/direct-push.sh main
```

---

## 5. Скрипты для Windows (опционально)

Создай `backup-push.bat` в `progects\scripts\`:

```batch
@echo off
cd /d "%~dp0.."
bash ./scripts/sync/direct-push.sh main
echo Done.
pause
```

Или PowerShell `backup-push.ps1`:

```powershell
Set-Location (Split-Path $PSScriptRoot)\..
bash ./scripts/sync/direct-push.sh main
Write-Host "Done."
```

Запускай двойным кликом после работы.

---

## 6. Восстановление config (Cursor / Codex)

После клона продублируй конфиг в нужные места:

```bash
# В Git Bash или PowerShell

# Cursor skills
xcopy /E /I /Y progects\config\cursor-skills "%USERPROFILE%\.cursor\skills"

# Cursor rules  
xcopy /E /I /Y progects\config\cursor-rules "%USERPROFILE%\.cursor\rules"

# Codex skills (если используешь Codex)
xcopy /E /I /Y progects\config\codex-skills "%USERPROFILE%\.codex\skills"
```

Создай папки, если их нет:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\skills"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor\rules"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.codex\skills"
```

---

## 7. Схема работы

| Действие          | Mac                              | Windows                       |
|-------------------|----------------------------------|-------------------------------|
| Бэкап на GitHub   | `bash scripts/sync/direct-push.sh main`  | `bash ./scripts/sync/direct-push.sh main` |
| Скачать изменения | `bash scripts/sync/direct-pull.sh main` | `bash ./scripts/sync/direct-pull.sh main` |
| Репо              | `<repo-root>`                    | `C:\Users\...\progects`       |

---

## 8. Если что-то пошло не так

**Конфликт при pull:**

```bash
git add -A
git commit -m "wip: save local work"
bash ./scripts/sync/direct-pull.sh main
```

**Забыл пароль / токен:**

- HTTPS: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- SSH: сгенерируй новый ключ и добавь его в GitHub

---

## Кратко

1. Установи Git, настрой имя/email и доступ к GitHub.
2. Сделай `git clone` в `progects`.
3. Работай прямо в `progects`, затем запускай `bash ./scripts/sync/direct-push.sh main`.
4. На другом ПК перед началом работы запускай `bash ./scripts/sync/direct-pull.sh main`.
