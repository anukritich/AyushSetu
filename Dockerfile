FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set PYTHONPATH so all src modules are importable
ENV PYTHONPATH=/app

# Default command (can be overridden by docker-compose)
CMD ["python", "-m", "src.utils.build_master_db"]
