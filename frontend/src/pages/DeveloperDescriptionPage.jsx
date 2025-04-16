import React from "react";
import {
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Facebook,
  Instagram,
} from "lucide-react";

const DeveloperDescriptionPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="bg-base-200 rounded-xl shadow-lg p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">
            Developer Information
          </h1>
          <p className="mt-2 text-zinc-400">
            Learn more about the developer behind this project
          </p>
        </div>

        {/* Developer Details */}
        <div className="mt-8 space-y-6">
          {/* Name */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Name</p>
              <p className="text-lg font-semibold">Shamem</p>
            </div>
          </div>

          {/* University */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">University</p>
              <p className="text-lg font-semibold">
                Chattagram University of Engineering and Technology (CUET)
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Email</p>
              <p className="text-lg font-semibold">developer@gmail.com</p>
            </div>
          </div>

          {/* GitHub */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">GitHub</p>
              <a
                href="https://www.facebook.com/sa.shamem.7/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline"
              >
                github.com/shamem
              </a>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Linkedin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/shamem-miah-2996902a5/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline"
              >
                https://www.linkedin.com/in/shamem-miah-2996902a5/
              </a>
            </div>
          </div>

          {/* Facebook */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Facebook className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Facebook</p>
              <a
                href=" https://www.facebook.com/sa.shamem.7/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline"
              >
                https://www.facebook.com/sa.shamem.7/
              </a>
            </div>
          </div>

          {/* Instagram */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Instagram className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Instagram</p>
              <a
                href="https://www.facebook.com/sa.shamem.7/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold hover:underline"
              >
                instagram.com/shamem
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-zinc-400">
          <p>© 2023 Shamem. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDescriptionPage;
