from setuptools import setup, find_packages

setup(
    name="ai-backend",
    version="0.1.0",
    author="Jacopo Madaluni",
    author_email="jacopo@audiogen.co",
    description="A short description of your package",
    long_description=open("../README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/JacopoMadaluni/ai-backend",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.10",
    install_requires=[
        # List your project dependencies here
        # For example:
        "requests",
        "fastapi"
        # "numpy>=1.20.0",
    ],
)
