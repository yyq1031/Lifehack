import app from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

const PORT = import.meta.env.VITE_PORT || 5001
const base = `http://localhost:${PORT}/api`;

export const signUp = async (name, email, password) => {
  const auth = getAuth(app);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const response = await fetch(`${base}/getprofile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    return { token: idToken, userData: data };

  } catch (error) {
    console.error("Signup error:", error.message);
  }
}

export const login = async (email, password) => {
  const auth = getAuth(app);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  
  const response = await fetch(`${base}/getprofile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  const data = await response.json();
  return { token: idToken, userData: data };
}

export const profile = async (idToken) => {
  if (!idToken) {
    // throw error
  }
    const response = await fetch(`${base}/profile`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  return data;
}

export const getClasses = async (idToken) => {
  try {
    const response = await fetch(`${base}/getClasses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Signup error:", error.message);
  }
}

export const getQuestions = async (idToken, lessonId) => {
  try {
    const response = await fetch(`${base}/getLesson/${lessonId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("error:", error.message);
  }
}

export const addClass = async (className, isActive) => {
  const response = await fetch(`${base}/createClass`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: className, active: isActive }),
    });
  const data = await response.json();
  return data;
}

export const getAllStudents = async (idToken) => {
  try {
    const response = await fetch(`${base}/getAllStudents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching students:", error.message);
  }
};

export const addStudentToClass = async (classId, studentId) => {
  const response = await fetch(`${base}/assignStudentToClass/${classId}/${studentId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    }});
  const data = await response.json();
  return data;
}

export const getStudentClassProgress = async (classId, idToken) => {
  try {
    const response = await fetch(`${base}/getStudentClassProgress/${classId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching student class progress:", error.message);
  }
};

export const updateQuizScore = async (quizes, confidenceLevels, lessonId, idToken) => {
  try {
    const response = await fetch(`${base}/updateProgress/${lessonId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizes, confidenceLevels }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error updating quiz score:", error.message);
  }
};

export const getClassLessonIds = async (idToken) => {
  try {
    const response = await fetch(`${base}/getClassAndLessons`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error getting class/lesson ids/names:", error.message);
  }
};


export const addNewQuiz = async (idToken, val) => {
  try {
    const response = await fetch(`${base}/createQuestion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify(val),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error getting class/lesson ids/names:", error.message);
  }
};
