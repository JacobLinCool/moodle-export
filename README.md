# Moodle Export

A streamlined library for retrieving data from Moodle.

[Documentation](https://jacoblincool.github.io/moodle-export/)

## Example

### An OOP approach

```ts
import { MoodleExporter } from "moodle-export";

// Initialize the exporter
const exporter = MoodleExporter.init({
    base: "https://moodle.example.com",
    username: "username",
    password: "password",
});

// Get all courses and their attendees and activities
const courses = await exporter.courses();
for (const course of courses) {
    console.log(course.fullname);
    const attendees = await course.attendees();
    const activities = await course.activities();
    console.log({ attendees, activities });
}
```

### A FP approach

```ts
import { login } from "moodle-export";

const base = "https://moodle.example.com";

// Create a fetcher
const fetcher = await login({
    base,
    username: "username",
    password: "password",
});

// Get all courses and their attendees and activities
const courses = await fetch_course_list(fetcher, base);
for (const course of courses) {
    console.log(course.fullname);
    const attendees = await fetch_course_attendees(fetcher, base, course.id);
    const activities = await fetch_course_activities(fetcher, base, course.id);
    console.log({ attendees, activities });
}
```
