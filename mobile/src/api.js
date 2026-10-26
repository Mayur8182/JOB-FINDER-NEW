import { Platform } from 'react-native';

// Dynamic local network IP so physical phone running Expo Go connects directly to host PC
const PC_LAN_IP = '10.131.232.11';

const BASE_URL = Platform.select({
  web: 'http://localhost:5000/api/v1',
  default: `http://${PC_LAN_IP}:5000/api/v1`
});

export const api = {
  async getJobs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/jobs${query ? `?${query}` : ''}`);
      return await res.json();
    } catch (e) {
      console.log("API offline, using standalone fallback");
      return { success: false };
    }
  },

  async getProfile() {
    try {
      const res = await fetch(`${BASE_URL}/profile`);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async getResumes() {
    try {
      const res = await fetch(`${BASE_URL}/resumes`);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async uploadResume(resumeData) {
    try {
      const res = await fetch(`${BASE_URL}/resumes/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async buildResume(builderData) {
    try {
      const res = await fetch(`${BASE_URL}/resumes/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(builderData)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async deleteResume(id) {
    try {
      const res = await fetch(`${BASE_URL}/resumes/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async getApplications() {
    try {
      const res = await fetch(`${BASE_URL}/applications`);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async applyToJob(jobId, applicationData) {
    try {
      const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async withdrawApplication(id) {
    try {
      const res = await fetch(`${BASE_URL}/applications/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async updateCandidateStatus(appId, status, note) {
    try {
      const res = await fetch(`${BASE_URL}/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async getSavedJobs() {
    try {
      const res = await fetch(`${BASE_URL}/saved-jobs`);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async toggleSaveJob(jobId) {
    try {
      const res = await fetch(`${BASE_URL}/saved-jobs/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async getNotifications() {
    try {
      const res = await fetch(`${BASE_URL}/notifications`);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async markAllNotificationsRead() {
    try {
      const res = await fetch(`${BASE_URL}/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async postJob(jobData) {
    try {
      const res = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }
};
