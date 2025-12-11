// import ProtectedRoute from "../ProtectedRoute";
// import TeacherDashboard from "../Pages/Teacher/TeacherDashboard";
// import TeacherBooks from "../Pages/Teacher/TeacherBooks";
// import TeacherStudents from "../Pages/Teacher/TeacherStudents";
// import TeacherProfile from "../Pages/Teacher/TeacherProfile";
// import TeacherRole from "../Pages/Teacher/TeacherRole";
// import TeacherUploadedBooks from "../Pages/Teacher/TeacherUploadBooks";
// import UploadChapter from "../Components/UploadChapter";

// export const teacherRouteList = [
//   {
//     path: "/teacher/dashboard",
//     element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>,
//   },
//   {
//     path: "/teacher/books",
//     element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherBooks /></ProtectedRoute>,
//   },
//   {
//     path: "/teacher/students",
//     element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherStudents /></ProtectedRoute>,
//   },
//   {
//     path: "/teacher/profile",
//     element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherProfile /></ProtectedRoute>,
//   },
//   {
//     path: "/teacher/role",
//     element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherRole /></ProtectedRoute>,
//   },
//   {
//     path: "/teacher/upload-books",
//     element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherUploadedBooks /></ProtectedRoute>,
//   },
//  {
//   path: "/books/:bookId/chapters",
//   element: (
//     <ProtectedRoute allowedRoles={["teacher", "admin", "principal"]}>
//       <UploadChapter />
//     </ProtectedRoute>
//   ),
// }

// ];

import ProtectedRoute from "../ProtectedRoute";
import TeacherDashboard from "../Pages/Teacher/TeacherDashboard";
import TeacherBooks from "../Pages/Teacher/TeacherBooks";
import TeacherStudents from "../Pages/Teacher/TeacherStudents";
import TeacherProfile from "../Pages/Teacher/TeacherProfile";
import TeacherRole from "../Pages/Teacher/TeacherRole";
import TeacherUploadedBooks from "../Pages/Teacher/TeacherUploadBooks";
import UploadChapter from "../Components/UploadChapter";
import CreateQuiz from "../Pages/Teacher/CreateQuiz";
import CreateAssignment from "../Pages/Teacher/CreateAssignment";
import TeacherForms from "../Pages/Teacher/DashboardForm";
import QuizStartUI from "../Pages/Teacher/ContentGenrator/QuizUI";
import { questions } from "../utils/questions";
import StudentList from "../Components/StudentList";
import AssignBookPage from "../Components/AssignBook";
export const teacherRouteList = [
  {
    path: "/teacher/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/books",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherBooks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/students",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherStudents />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/profile",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/role",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherRole />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/upload-books",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <TeacherUploadedBooks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/assignment",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <CreateAssignment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/quiz",
    element: (
      <ProtectedRoute allowedRoles={["teacher"]}>
        <CreateQuiz />
      </ProtectedRoute>
    ),
  },
  {
    path: "/books/:bookId/chapters",
    element: (
      <ProtectedRoute allowedRoles={["teacher", "admin", "principal"]}>
        <UploadChapter />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/form/:formType",
    element: (
      <ProtectedRoute allowedRoles={["teacher", "admin", "principal"]}>
        <TeacherForms />
      </ProtectedRoute>
    ),
  },
  {
    path: "start-quiz",
    element: (
      <ProtectedRoute allowedRoles={["teacher", "admin", "principal"]}>
        <QuizStartUI questions={questions} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/students",
    element: (
      <ProtectedRoute allowedRoles={["teacher", "admin", "principal"]}>
        <StudentList />
        {/* <QuizStartUI questions={questions} /> */}
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/assign-book/:username",
    element: (
      <ProtectedRoute allowedRoles={["teacher", "admin", "principal"]}>
        <AssignBookPage />
        {/* <QuizStartUI questions={questions} /> */}
      </ProtectedRoute>
    ),
  },
];
