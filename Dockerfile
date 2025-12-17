
# Use a lightweight Nginx image for the production environment
FROM nginx:stable-alpine

# Copy the custom Nginx configuration. This replaces the default config.
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all application files to the Nginx web root directory
# This includes index.html, *.tsx, and all subdirectories (components, hooks, etc.)
COPY . /usr/share/nginx/html

# Expose port 8080 to the outside world
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
