package middleware

import (
	"log"
	"net/http"
	"time"
)

type Logger struct {
	handler http.Handler
}

type ResponseWriterWrapper struct {
	http.ResponseWriter
	StatusCode int
}

// implements the http.Handler interface
func (l *Logger) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	wrappedWriter := &ResponseWriterWrapper{ResponseWriter: w}
	// Call the next handler in the chain
	l.handler.ServeHTTP(wrappedWriter, r)
	log.Printf("%s %s %d %v", r.Method, r.URL.Path, wrappedWriter.StatusCode, time.Since(start))
}

// create new logger middeware
func NewLogger(handlerToWrap http.Handler) *Logger {
	return &Logger{handlerToWrap}
}

func (w *ResponseWriterWrapper) WriteHeader(code int) {
	w.StatusCode = code
	w.ResponseWriter.WriteHeader(code)
}
