import logging
import os
import src.settings.config as config


class AyushSetuServiceInitializer:
    """Initializes the AyushSetu terminology microservice."""
    paths = [
            config.WHO_TERMINOLOGIES_JSON_FOLDER,
            config.NAMC_AYURVEDA,
            config.NAMC_UNANI,
            config.NAMC_SIDDHA
        ]

    def __init__(self):
        self.logger = logging.getLogger("AyushSetu")
        self.logger.info("Initializing AyushSetu Terminology Microservice...")


        # Example: initialize ingestor or other required objects here
        class DummyIngestor:
            db_path = config.WHO_TERMINOLOGIES_MASTER_DB
            json_folder = config.WHO_TERMINOLOGIES_JSON_FOLDER
        self.ingestor = DummyIngestor()

    def checkAllFilesExist(self) -> bool:
        """Check if all required files and directories exist."""

        required_paths = self.paths
        missing_paths = [path for path in required_paths if not os.path.exists(path)]
        if missing_paths:
            for path in missing_paths:
                self.logger.error(f"Required path does not exist: {path}")
            return False
        self.logger.info("All required files and directories exist.")
        return True 
    

if __name__ == "__main__":
    initializer = AyushSetuServiceInitializer()
    if initializer.checkAllFilesExist():
        initializer.logger.info("Initialization successful. All systems go!")
    else:
        initializer.logger.error("Initialization failed due to missing files or directories.")
