import React, { useEffect, useState } from 'react';
import { Star, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  rating: number;
  status: string;
  submittedAt: string;
  approvedAt?: string;
}

interface FeedbackSectionProps {
  userId: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ userId }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    supabase.from('feedback').select('*').eq('status', 'approved').then(({ data }) => setFeedback(data || []));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setMessage('');
      alert('Thank you for your feedback! It will be reviewed and published soon.');
    }, 2000);
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= count
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Submit Feedback */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Feedback</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate your experience
            </label>
            {renderStars(rating, true)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience with our service..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {submitted ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>

      {/* Customer Reviews */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Customer Reviews</h3>
        
        {feedback.length > 0 ? (
          <div className="space-y-4">
            {feedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold text-sm">
                        {feedback.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{feedback.userName}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(feedback.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {renderStars(feedback.rating)}
                </div>
                <p className="text-gray-700">{feedback.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reviews available yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;