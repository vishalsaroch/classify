import { useEffect } from 'react';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../../utils/Firebase';

const GitHubAuth = () => {
  const handleGitHubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      // Handle successful login
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <button onClick={handleGitHubLogin}>
      Sign in with GitHub
    </button>
  );
};

export default GitHubAuth;