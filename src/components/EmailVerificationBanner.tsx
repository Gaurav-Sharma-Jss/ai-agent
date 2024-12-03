import React from 'react';
import { AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function EmailVerificationBanner() {
  const { user, sendVerificationEmail } = useAuth();
  const [isResending, setIsResending] = React.useState(false);
  const [cooldownTime, setCooldownTime] = React.useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime(time => Math.max(0, time - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownTime]);

  if (!user || user.emailVerified) return null;

  const handleResendEmail = async () => {
    if (isResending || cooldownTime > 0) return;
    
    setIsResending(true);
    try {
      await sendVerificationEmail();
      toast({
        title: 'Success',
        description: 'Verification email sent. Please check your inbox.',
        type: 'success'
      });
      setCooldownTime(60); // 60 seconds cooldown
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        type: 'error'
      });
      if (error.message.includes('wait')) {
        const seconds = parseInt(error.message.match(/\d+/)[0]);
        setCooldownTime(seconds);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">
              Please verify your email address to access all features
            </p>
          </div>
          <button
            onClick={handleResendEmail}
            disabled={isResending || cooldownTime > 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-800 
                     bg-yellow-100 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            <Mail className="w-4 h-4" />
            {isResending ? 'Sending...' : 
             cooldownTime > 0 ? `Retry in ${cooldownTime}s` : 
             'Resend Verification Email'}
          </button>
        </div>
      </div>
    </div>
  );
}