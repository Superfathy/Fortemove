export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = async () => {
  try {
    // Call the logout API endpoint
    await fetch("http://localhost:3000/api/v1/users/logout", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // Clear local storage regardless of API call success
    removeToken();
    removeUser();
    window.location.href = "/login";
  }
};
