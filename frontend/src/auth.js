import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Use JWT strategy (no database sessions)
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  // Pages configuration
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Authentication providers
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      // Authorization function
      async authorize(credentials) {
        try {
          // Call backend login API
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || "Login failed");
          }

          // Return user object with token
          return {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            roleId: data.data.user.roleId,
            roleName: data.data.user.role.name,
            tenantId: data.data.user.tenantId,
            permissions: data.data.user.permissions,
            token: data.data.token,
            isActive: data.data.user.isActive,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    /**
     * JWT callback
     * Called whenever a JWT is created or updated
     */
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roleId = user.roleId;
        token.roleName = user.roleName;
        token.tenantId = user.tenantId;
        token.permissions = user.permissions || [];
        token.backendToken = user.token; // Store backend JWT
        token.isActive = user.isActive;
      }

      // Update session (when calling update())
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.email = session.email || token.email;
      }

      return token;
    },

    /**
     * Session callback
     * Called whenever a session is checked
     */
    async session({ session, token }) {
      // If no token, return null to force logout
      if (!token || !token.id) {
        return null;
      }

      // Add custom fields to session
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        roleId: token.roleId,
        roleName: token.roleName,
        tenantId: token.tenantId,
        permissions: token.permissions || [],
        isActive: token.isActive,
      };

      // Expose access token for API calls
      session.accessToken = token.backendToken;

      return session;
    },

    /**
     * Authorized callback
     * Used by middleware to protect routes
     */
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Public paths that don't require authentication
      const publicPaths = ["/", "/login", "/signup"];
      const isPublicPath = publicPaths.includes(pathname);

      // Allow access to public paths
      if (isPublicPath) {
        return true;
      }

      // Check if user is authenticated
      const isAuthenticated = !!auth?.user;

      // Require authentication for protected paths
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
        return isAuthenticated;
      }

      return true;
    },
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
});

/**
 * Helper function to check if user has specific role
 * @param {Object} session - NextAuth session
 * @param {string|string[]} roles - Role name(s) to check
 * @returns {boolean}
 */
export function hasRole(session, roles) {
  if (!session?.user) return false;
  
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(session.user.roleName);
}

/**
 * Helper function to check if user has specific permission
 * @param {Object} session - NextAuth session
 * @param {string|string[]} permissions - Permission name(s) to check
 * @returns {boolean}
 */
export function hasPermission(session, permissions) {
  if (!session?.user) return false;
  
  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  const userPermissions = session.user.permissions.map(p => p.name);
  
  return permissionArray.some(permission => userPermissions.includes(permission));
}

/**
 * Helper function to check if user is super admin
 * @param {Object} session - NextAuth session
 * @returns {boolean}
 */
export function isSuperAdmin(session) {
  return hasRole(session, "super_admin");
}

/**
 * Helper function to check if user belongs to a specific tenant
 * @param {Object} session - NextAuth session
 * @param {string} tenantId - Tenant ID to check
 * @returns {boolean}
 */
export function belongsToTenant(session, tenantId) {
  if (!session?.user) return false;
  
  // Super admin can access all tenants
  if (isSuperAdmin(session)) return true;
  
  return session.user.tenantId === tenantId;
}
