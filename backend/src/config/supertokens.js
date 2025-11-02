import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session/index.js';
import EmailPassword from 'supertokens-node/recipe/emailpassword/index.js';
import Dashboard from 'supertokens-node/recipe/dashboard/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function initSuperTokens() {
  supertokens.init({
    framework: 'express',
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || 'https://try.supertokens.com',
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: process.env.APP_NAME || 'LetsPrint',
      apiDomain: process.env.API_DOMAIN || 'http://localhost:5000',
      websiteDomain: process.env.WEBSITE_DOMAIN || 'http://localhost:3000',
      apiBasePath: '/auth',
      websiteBasePath: '/login',
    },
    recipeList: [
      EmailPassword.init({
        signUpFeature: {
          formFields: [
            {
              id: 'name',
              optional: true,
            },
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async function (input) {
                if (originalImplementation.signUpPOST === undefined) {
                  throw Error('Should never come here');
                }

                // Call the original implementation
                let response = await originalImplementation.signUpPOST(input);

                // If sign up was successful, create user in our database
                if (response.status === 'OK') {
                  const { id, email } = response.user;
                  const formFields = input.formFields;
                  const name = formFields.find(f => f.id === 'name')?.value;

                  try {
                    await prisma.user.create({
                      data: {
                        supertokensId: id,
                        email: email,
                        name: name || null,
                        role: 'USER',
                      },
                    });
                  } catch (error) {
                    console.error('Error creating user in database:', error);
                  }
                }

                return response;
              },
            };
          },
        },
      }),
      Session.init({
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              createNewSession: async function (input) {
                // Get user from database
                const user = await prisma.user.findUnique({
                  where: { supertokensId: input.userId },
                  select: { id: true, role: true, email: true, name: true },
                });

                // Add custom claims to session
                input.accessTokenPayload = {
                  ...input.accessTokenPayload,
                  userId: user?.id,
                  role: user?.role,
                  email: user?.email,
                  name: user?.name,
                };

                return originalImplementation.createNewSession(input);
              },
            };
          },
        },
      }),
      Dashboard.init(),
    ],
  });
}

export { supertokens, Session, EmailPassword };
