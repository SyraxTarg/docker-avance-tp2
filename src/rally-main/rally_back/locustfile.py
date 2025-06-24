from locust import HttpUser, task, constant

class MyUser(HttpUser):
    wait_time = constant(1)

    @task(3)
    def events(self):
        self.client.get("/api/v1/events")

    @task(3)
    def planners(self):
        self.client.get("/api/v1/profiles/planners")

