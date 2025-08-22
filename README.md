# ⚰️ Race to the Coffin

**Race to the Coffin** is a fun, thought-provoking, and interactive web-based game that visualizes the journey of life based on user inputs.  
With humor and creativity, it blends **life expectancy prediction** with **game mechanics** — where a shovel-holding character races toward a coffin depending on how long you might live.  

---

## 🌟 Features

- 🧍 **Animated Character**  
  A person holding a shovel on the left side of the screen that moves closer or farther from the coffin based on your expected lifespan.

- 📸 **Dynamic Face Replacement**  
  Replace the character’s face with **your own photo** (via upload or live camera capture).

- 📍 **Personalized Predictions**  
  Life expectancy calculated based on:
  - Name  
  - Age  
  - Gender  
  - Geographical locality  
  - Favorite foods  

- ⚰️ **Coffin Interaction**  
  - If you have many years left → the coffin is far away.  
  - If you have only a few days → the character stands inside the coffin.  
  - If you have just minutes → the character lays **inside** the coffin.  

- 🎨 **Dynamic UI & Background**  
  The background theme changes (day/night/seasonal vibes) based on your remaining lifespan for extra immersion.

---

## 📊 Algorithm for Life Expectancy

Here’s the simplified calculation model:

1. **Base life expectancy** is set from the user’s **geographical locality** (e.g., WHO data averages).
2. Adjust expectancy:
   - **Age & Gender** (subtract current age, adjust based on gender trends).  
   - **Food choices** (healthy foods → + years, unhealthy → - years).  
   - **Random factor** (a little unpredictability to mimic real life).
3. Convert remaining years into **days** and **minutes**.
4. Map result to **game visuals**:
   - `remaining_days > 10000` → character far from coffin.  
   - `100 < remaining_days < 1000` → character near coffin.  
   - `1 < remaining_days < 100` → character inside coffin.  
   - `remaining_minutes < 60` → character lies down in coffin.  

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)  
- **Media Handling:** HTML5 `<video>` & `<canvas>` for live photo capture  
- **Animations:** CSS animations & JavaScript movement logic  
- **Design:** Minimal, clean, game-like UI with responsive layout  

---

## 👤 Author Note

This project was built with the idea of turning a deep, reflective concept of life into something fun, engaging, and thought-provoking.
It is not scientifically accurate and should be taken as entertainment rather than health advice.
I enjoyed blending humor, creativity, and technology to build Race to the Coffin — hope you enjoy playing it as much as I enjoyed making it!

— ✍️ *Jency*

---

## 📜 License

This project is licensed under the **MIT License**.  

You are free to use, modify, and distribute this project, provided proper credit is given.  
