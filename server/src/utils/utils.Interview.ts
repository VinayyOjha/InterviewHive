import { PrismaClient } from "@prisma/client";
import { InterviewDetails } from "../services/Interview";
const prisma = new PrismaClient();

export const AllInterviews = async (
  tags: string[],
  companyName: string | undefined,
  page: number = 1,
  limit: number = 10
) => {
  const whereConditions: any = {};

  if (tags && tags.length > 0) {
    whereConditions.tags = {
      some: {
        tagName: {
          in: tags,
        },
      },
    };
  }

  if (companyName && companyName.trim() !== "") {
    whereConditions.companyName = {
      contains: companyName.trim(),
      mode: "insensitive", // For case-insensitive search (PostgreSQL, MySQL)
    };
  }

  const interviews = await prisma.interview.findMany({
    where: whereConditions,
    include: {
      interviewRounds: {
        include: {
          questions: true,
        },
      },
      tags: {
        select: {
          id: true,
          tagInitials: true,
          tagName: true,
        },
      },
      user: {
        select: {
          username: true,
          id: true,
          courseId: true,
          yearOfPassingOut: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCount = await prisma.interview.count({
    where: whereConditions,
  });

  return { data: interviews, totalCount };
};

export const fetchInterviewsSharedByUser = async (userId: string) => {
  const response = await prisma.interview.findMany({
    where: {
      authorId: userId,
    },
    include: {
      interviewRounds: {
        include: {
          questions: true,
        },
      },
      tags: true,
      user: {
        select: {
          username: true,
          id: true,
          courseId: true,
          yearOfPassingOut: true,
        },
      },
    },
  });

  return response;
};

export const fetchSavedInterviewExperience = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const savedInterviewIdsArray = await prisma.savedInterview.findMany({
    where: {
      userId,
    },
    select: {
      interviewId: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      savedAt: "desc",
    },
  });

  let savedExperiences = [];

  for (let interview of savedInterviewIdsArray) {
    const response = await prisma.interview.findFirst({
      where: {
        id: interview.interviewId,
      },
      include: {
        interviewRounds: {
          include: {
            questions: true,
          },
        },
        tags: true,
        user: {
          select: {
            username: true,
            id: true,
            courseId: true,
            yearOfPassingOut: true,
          },
        },
      },
    });
    savedExperiences.push(response);
  }

  const totalCount = savedExperiences.length;
  return { data: savedExperiences, totalCount };
};

export const fetchInterviewById = async (interviewId: string) => {
  const response = await prisma.interview.findFirst({
    where: {
      id: interviewId,
    },
    include: {
      interviewRounds: {
        include: {
          questions: true,
        },
      },
      tags: true,
    },
  });

  return response;
};

export const createInterviewExperience = async (
  interviewData: InterviewDetails
) => {
  const result = await prisma.$transaction(
    async (tx) => {
      // 1. Create the Interview instance with nested operations for tags, rounds, and questions.
      const newInterview = await tx.interview.create({
        data: {
          companyName: interviewData.companyName.toUpperCase(),
          yearOfInterview: interviewData.yearOfInterview,
          role: interviewData.role.toUpperCase(),
          CTCOffered: interviewData.CTCOffered,
          interviewStatus: interviewData.interviewStatus.toUpperCase(),
          difficultyLevel: interviewData.difficultyLevel,

          user: {
            connect: {
              id: interviewData.authorId, // Connect to an existing user by their ID
            },
          },

          // Use `connectOrCreate` to handle InterviewTags for the many-to-many relationship.
          // This will:
          //   a) Find an existing InterviewTag by `tagInitials`.
          //   b) If not found, create a new InterviewTag with that `tagName`.
          //   c) Establish the link in the `_InterviewToTag` join table for this interview.
          tags: {
            connectOrCreate: interviewData.tags.map((tag) => ({
              where: { tagInitials: tag.tagInitials }, // Try to find an existing tag by its unique name
              create: {
                tagName: tag.tagName,
                tagInitials: tag.tagInitials, // Ensure tagInitials is provided
              }, // If not found, create a new tag
            })),
          },

          // Use nested `create` for InterviewRounds (one-to-many relationship).
          // Each round's `interviewId` will automatically be set by Prisma.
          interviewRounds: {
            create: interviewData.interviewRounds.map((round) => ({
              roundType: round.roundType,
              note: round.note,
              // Use nested `create` for Questions within each InterviewRound.
              // Each question's `roundId` will automatically be set by Prisma.
              questions: {
                create: round.questions.map((question) => ({
                  title: question.title,
                  description: question.description,
                  link: question.link,
                })),
              },
            })),
          },
        },
        // Include related data in the returned object to confirm creation
        include: {
          tags: true, // Confirm tags were linked
          interviewRounds: {
            include: {
              questions: true, // Confirm questions were linked
            },
          },
          // You might also include the user if needed:
          // user: { select: { userId: true, username: true } },
        },
      });

      // The transaction will return the entire newInterview object if successful
      return newInterview;
    },
    {
      maxWait: 10000, // wait up to 10s to get a database connection
      timeout: 20000, // allow up to 20s for the transaction to complete
    }
  );

  return result;
};

export const deleteUserInterviewExperience = async (interviewId: string) => {
  const result = await prisma.interview.delete({
    where: {
      id: interviewId,
    },
    include: {
      interviewRounds: {
        include: {
          questions: true,
        },
      },
    },
  });
  return result;
};

export const updateUserInterviewExperience = async (
  interviewId: string,
  interviewData: InterviewDetails
) => {
  await prisma.interview.delete({
    where: {
      id: interviewId,
    },
    include: {
      interviewRounds: {
        include: {
          questions: true,
        },
      },
    },
  });
  await createInterviewExperience(interviewData);
  return true;
};
